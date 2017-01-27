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

function Enemy(name, demage, health) {
    this.name = name;
    this.demage = demage;
    this.health = health;
}

function emptyBoard() {
    var board = [];
    for (var i = 0; i < 100; i++)
        for (var j = 0; j < 40; j++) {
            board.push(null)
        }
    return board;
}

function toggleDarckness(pos) {
    var indexes = [];
    var currPos = pos - 3 - 100 * 3;

    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            indexes.push(currPos + j + i * 100);
        }
    }
    return indexes;
}

function roomGeneration() {
    var roomCollection = [];

    function room(point, x, y) {
        var indexes = [];
        for (var i = 0; i < x; i++) {
            for (var j = 0; j < y; j++) {
                indexes.push(point + i + j * 100);
            }
        }
        return indexes;
    }

    function intersect(left, right) {
        return left.filter(function (el) {
            return right.indexOf(el) != -1;
        });
    }

    function doseWall(arr) {
        var width = Math.sqrt(arr.length);
        var index = Math.floor(arr[0] / 100);

        for (var i = 0; i < width; i++) {

            if (Math.floor(((arr[i * width]) / 100)) != index) {
                return true;
            }
        }
        return false;
    }

    while (roomCollection.length < 15) {
        var intersection = false;
        var point = Math.floor(Math.random() * 4000);
        if (point > (4000 - 10 - 10 * 100)) {
            point = 4000 - 10 - 10 * 100;
        }
        var tempRoom = room(point, 10, 10);
        for (var i = 0; i < roomCollection.length; i++) {
            if (((intersect(tempRoom, roomCollection[i])).length) || (doseWall(tempRoom))) {
                intersection = true;
            }
        }
        if (!intersection) {
            roomCollection.push(tempRoom);
        }
    }
    return roomCollection;
}

function newBoard() {
    var board = emptyBoard();
    var rooms = roomGeneration();

    function getWay(point1, point2) {
        var coridor = [];

        function getCrossPoint(p1, p2) {
            if (p1 > p2) {
                var temp = p1;
                p1 = p2;
                p2 = temp;
            }
            var l1 = 100 - (p1 % 100);
            var l2 = Math.floor(p2 / 100);
            for (var i = 0; i <= l1; i++) {
                for (var j = 0; j <= l2; j++) {
                    if ((p1 + i) == (p2 - j * 100)) {
                        return p1 + i
                    }
                }
            }
            for (var i = 0; i <= (p1 % 100); i--) {
                for (var j = 0; j <= l2; j++) {
                    if ((p1 + i) == (p2 - j * 100)) {
                        return p1 + i
                    }
                }
            }
        }

        function getCoridor(p1, p2) {
            var crossPoint = getCrossPoint(p1, p2)
            coridor.push(crossPoint);
            if (p1 > p2) {
                var temp = p1;
                p1 = p2;
                p2 = temp;
            }
            if (crossPoint < p1) {
                for (var j = 0; j < p1 - crossPoint; j++)
                    coridor.push(p1 - j);
            } else {
                for (var j = 0; j < crossPoint - p1; j++)
                    coridor.push(p1 + j)
            }
            for (var i = 0; i < ((p2 - crossPoint) / 100); i++)
                coridor.push(p2 - i * 100)
        }

        getCoridor(point1, point2);

        return coridor
    }

    var coridors = [];
    for (var i = 0; i < rooms.length - 1; i++) {
        coridors.push(getWay(rooms[i][0], rooms[i + 1][0]));
    }
    var roomsWithCoridors = rooms.concat(coridors);

    for (var i = 0; i < roomsWithCoridors.length; i++) {
        for (var j = 0; j < roomsWithCoridors[i].length; j++) {
            board[roomsWithCoridors[i][j]] = EMPTY
        }
    }
    function setEntyty(entyty, number) {
        if (entyty.name == 'enemy') {
            var counter = 0;
            while (counter < number) {
                var index = Math.floor(Math.random() * 4000);
                if (board[index] == EMPTY) {
                    counter++;
                    board[index] = new Enemy('enemy', 10, 100)
                }
            }
        } else {
            var counter = 0;
            while (counter < number) {
                var index = Math.floor(Math.random() * 4000);
                if (board[index] == EMPTY) {
                    counter++;
                    board[index] = entyty
                }
            }
        }
    }

    function setWall() {
        for (var i = 0; i < board.length; i++) {
            if (!board[i]) board[i] = WALL;
        }
    }

    setEntyty(ENEMY, 10);
    setEntyty(PLAYER, 1);
    setEntyty(BOSS, 1);
    setEntyty(HEALTH, 20);
    setEntyty(WEAPON, 10);
    setEntyty(PORTAL, 3);
    setWall();

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
    if (board[player + MOVES[direction]].name == 'enemy') {

        PLAYER.health -= board[player + MOVES[direction]].demage;
        board[player + MOVES[direction]].health -= PLAYER.demage;
        if (PLAYER.health <= 0) {
            board[player] = EMPTY;
            PLAYER.exp = 0;
            PLAYER.level = 0;
            PLAYER.health = 100;
            PLAYER.demage = 10;

        } else if (board[player + MOVES[direction]].health <= 0) {
            board[player] = EMPTY;
            PLAYER.exp += 10;
            PLAYER.level = Math.floor(PLAYER.exp / 45);

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
            lose: false,
            darckness: true
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

        const cellStyle = {
            clear: 'both'
        };
        var playerPos = this.state.board.indexOf(PLAYER);
        var unToggle = toggleDarckness(playerPos);

        function steClass(item, index) {
            if ((unToggle.indexOf(index) == -1) && (same.state.darckness)) {
                return item.name + ' toggle'
            } else {
                return item.name
            }
        }

        var field = this.state.board.map(function (item, index) {
            if (((index % 100) == 0) && (index != 0)) {
                if (item.name == 'player') {
                    playerPos = index;
                    return <div style={cellStyle} id={index} className={steClass(item,index)}></div>
                } else {
                    return <div style={cellStyle} id={index} className={steClass(item,index)}></div>
                }
            } else {
                if (item.name == 'player') {
                    playerPos = index;
                    return <div id={index} className={steClass(item,index)}></div>
                } else {
                    return <div id={index} className={steClass(item,index)}></div>
                }
            }
        });

        return (
            field
        )
    },
    toggleDarckness: function () {
        var darckness = this.state.darckness;
        this.setState({
            darckness: !darckness
        })
    },

    render: function () {
        window.addEventListener("keydown", this.move);
        if (this.state.lose) {
            return (<div>
                    <div className='message'>
                        You lose!!!
                    </div>
                    <button onClick={this.getField}>New game</button>
                </div>
            )
        } else if (this.state.win) {
            return (<div className='message'>
                You win!!!
                <button onClick={this.getField}>New game</button>
            </div>)
        } else
            return (<div>
                    <div className='container'>
                        <div className='header'>
                            <div className='info'>Health: {this.state.player.health}</div>
                            <div className='info'>Experience: {this.state.player.exp}</div>
                            <div className='info'>Level: {this.state.player.level}</div>
                            <div className='info'>Weapon demage: {this.state.player.demage}</div>
                            <div className='info'>
                                <button onClick={this.toggleDarckness}>Toggle Darckness</button>
                            </div>
                        </div>
                    </div>
                    <div className='grid'>
                        {this.getField()}
                    </div>
                    <div className='container'>
                        <div className='entities'>
                            <div className='footer'>
                                <div className='enemy'></div>
                                <div>Enemy</div>
                            </div>
                            <div className='footer'>
                                <div className='boss'></div>
                                <div>Boss</div>
                            </div>
                            <div className='footer'>
                                <div className='health'></div>
                                <div>Health</div>
                            </div>
                            <div className='footer'>
                                <div className='weapon'></div>
                                <div>Weapon</div>
                            </div>
                            <div className='footer'>
                                <div className='portal'></div>
                                <div>Portal</div>
                            </div>
                            <div className='footer'>
                                <div className='player'></div>
                                <div>You</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
});

ReactDOM.render(
    <Board />,
    document.getElementById('box')
);
