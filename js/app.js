/**
 * Created by Iaroslav Zhbankov on 25.01.2017.
 */

var EMPTY = {
    name: 'empty'
};
var WALL = {
    name: 'wall'
};
var PLAYER = {
    name: 'player',
    exp: 0,
    level: 0,
    health: 100,
    demage: 10
};
var ENEMY = {
    name: 'enemy',
    health: 100,
    demage: 10
};
var BOSS = {
    name: 'enemy',
    health: 300,
    demage: 100
};
var HEALTH = {
    name: 'health',
    health: 20
};
var WEAPON = {
    name: 'weapon',
    demage: 10
};
var PORTAL = {
    name: 'portal'
};
var MOVES = {
    'ArrowUp': -100,
    'ArrowDown': 100,
    'ArrowLeft': -1,
    'ArrowRight': 1
};

function emptyBoard() {
    var board = [];
    for (var i = 0; i < 100; i++)
        for (var j = 0; j < 40; j++) {
            board.push(null)
        }
    return board;
}

function newBoard() {
    var board = emptyBoard();

    for (var i = 0; i < board.length; i++) {
        board[i] = EMPTY
    }
    function setEntyty(entyty, number) {
        var counter = 0;
        while (counter < number) {
            var index = Math.floor(Math.random() * 4000);
            if (board[index] == EMPTY) {
                counter++;
                board[index] = entyty
            }
        }
    }

    setEntyty(ENEMY, 10);
    setEntyty(PLAYER, 1);
    setEntyty(BOSS, 1);
    setEntyty(HEALTH, 10);
    setEntyty(WEAPON, 10);
    setEntyty(WALL, 500);
    setEntyty(PORTAL, 3);

    return board;
}

function playerMove(board, direction) {
    var player = board.indexOf(PLAYER);
    if ((board[player + MOVES[direction]] == EMPTY) && (board[player + MOVES[direction]]) &&
        ((player + MOVES[direction]) % 100 != 0)) {
        board[player] = EMPTY;
        board[player + MOVES[direction]] = PLAYER;
    }
    if ((board[player + MOVES[direction]] == PORTAL)) {
        var counter = 0;
        board[player] = EMPTY;
        while (counter < 1) {
            var index = Math.floor(Math.random() * 4000);
            if (board[index] == EMPTY) {
                counter++;
                board[index] = PLAYER;
            }
        }
    }
    return board;
}

var Board = React.createClass({
    getInitialState: function () {
        return {
            board: newBoard()
        }
    },
    move: function (e) {
        var newBoard = playerMove(this.state.board, e.code)
        this.setState({
            board: newBoard
        })

    },
    getField: function () {
        var same = this;
        window.onKeyPress = this.move;
        const cellStyle = {
            clear: 'both'
        };
        var field = this.state.board.map(function (item, index) {
            if (((index % 100) == 0) && (index != 0)) {
                if (item.name == 'player') {
                    return <div style={cellStyle} id={index} className={item.name}></div>
                } else {
                    return <div style={cellStyle} id={index} className={item.name}></div>
                }
            } else {
                if (item.name == 'player') {
                    return <div id={index} className={item.name}></div>
                } else {
                    return <div id={index} className={item.name}></div>
                }
            }
        });
        return (
            field
        )
    },
    render: function () {
        window.addEventListener("keydown", this.move);
        return (<div>
                <div className='grid'>
                    {this.getField()}
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <Board />,
    document.getElementById('box')
);
