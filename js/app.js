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
    name: 'boss',
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
    setEntyty(HEALTH, 20);
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
    if (board[player + MOVES[direction]] == HEALTH) {
        board[player] = EMPTY;
        board[player + MOVES[direction]] = PLAYER;
        PLAYER.health += HEALTH.health;
    }
    if (board[player + MOVES[direction]] == WEAPON) {
        board[player] = EMPTY;
        board[player + MOVES[direction]] = PLAYER;
        PLAYER.demage += (WEAPON.demage + PLAYER.level * 10);
    }
    if (board[player + MOVES[direction]] == ENEMY) {
        var currentEnemy = ENEMY;
        PLAYER.health -= currentEnemy.demage;
        currentEnemy.health -= PLAYER.demage;
        if (PLAYER.health <= 0) {
            board[player] = EMPTY;
            PLAYER.exp = 0;
            PLAYER.level = 0;
            PLAYER.health = 100;
            PLAYER.demage = 10;
            ENEMY.health = 100;
        } else if (currentEnemy.health <= 0) {
            board[player] = EMPTY;
            PLAYER.exp += 10;
            PLAYER.level = Math.floor(PLAYER.exp / 45);
            ENEMY.health = 100;
            board[player + MOVES[direction]] = PLAYER;
        }

    }
    if (board[player + MOVES[direction]] == BOSS) {
        PLAYER.health -= BOSS.demage;
        BOSS.health -= PLAYER.demage;
        if (PLAYER.health <= 0) {
            board[player] = EMPTY;
            PLAYER.exp = 0;
            PLAYER.level = 0;
            PLAYER.health = 100;
            PLAYER.demage = 10;
            ENEMY.health = 100;
        } else if (BOSS.health <= 0) {
            board[player] = EMPTY;
            BOSS.health = 300;
            board[player + MOVES[direction]] = PLAYER;
            PLAYER.exp = 0;
            PLAYER.level = 0;
            PLAYER.health = 100;
            PLAYER.demage = 10;
            ENEMY.health = 100;
        }

    }

    return board;
}

var Board = React.createClass({
    getInitialState: function () {
        return {
            board: newBoard(),
            player: PLAYER,
            win: false,
            lose: false
        }
    },
    move: function (e) {
        var newBoard = playerMove(this.state.board, e.code);
        if (newBoard.indexOf(PLAYER) == -1) {
            this.setState({
                board: newBoard,
                player: PLAYER,
                lose: true
            })
        } else if (newBoard.indexOf(BOSS) == -1) {
            this.setState({
                board: newBoard,
                player: PLAYER,
                win: true
            })
        }
        else {
            this.setState({
                board: newBoard,
                player: PLAYER
            })
        }
    },
    getField: function () {
        var same = this;
        if ((this.state.lose == true) || (this.state.win == true)) {
            this.setState({
                lose: false,
                win: false,
                board: newBoard()
            });
        }
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
        if (this.state.lose) {
            return (<div>
                    You lose!!!
                    <button onClick={this.getField}>New game</button>
                </div>
            )
        } else if (this.state.win) {
            return (<div>
                You win!!!
                <button onClick={this.getField}>New game</button>
            </div>)
        } else
            return (<div>
                    <div className='playerInfo'>
                        <div>Health: {this.state.player.health}</div>
                        <div>Experience: {this.state.player.exp}</div>
                        <div>Level: {this.state.player.level}</div>
                        <div>Weapon demage: {this.state.player.demage}</div>
                    </div>
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
