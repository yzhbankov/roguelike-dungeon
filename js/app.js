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
console.log(newBoard());

var Board = React.createClass({
    getInitialState: function () {
        return {
            board: newBoard()
        }
    },
    getField: function () {
        var same = this;
        const cellStyle = {
            clear: 'both'
        };
        console.log(this.state.board);
        var field = this.state.board.map(function (item, index) {
            if (((index % 100) == 0) && (index != 0)) {
                return <div style={cellStyle} id={index} className={item.name}></div>
            } else {
                return <div id={index} className={item.name}></div>
            }
        });
        return (
            field
        )
    },
    render: function () {
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
