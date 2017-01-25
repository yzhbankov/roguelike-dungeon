/**
 * Created by Iaroslav Zhbankov on 25.01.2017.
 */

function newBoard() {
    var board = [];
    for (var i = 0; i < 100; i++)
        for (var j = 0; j < 40; j++) {
            board.push(null)
        }
    return board;
}

var Board = React.createClass({
    getInitialState: function(){
      return{
          board: newBoard()
      }
    },
    getField: function(){
        var same = this;
        const cellStyle = {
            clear: 'both'
        };
        var field = this.state.board.map(function(item, index){
            if (((index % 100) == 0) && (index != 0)) {
                return <div style={cellStyle} id={index} className='empty'></div>
            } else {
                return <div id={index} className='empty'></div>
            }
        });
        return(
        field
        )
    },
    render: function(){
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
