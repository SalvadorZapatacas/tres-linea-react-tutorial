import React , {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/*   SQUARE    */
    function Square(props) {

      return (
          <button 
              className="square" 
              onClick={() =>  props.onClick() }
          >
              { props.value }
          </button>
      );
        
    }
  



    /* BOARD  */

  class Board extends Component {


    renderSquare(i) {
      return( 
        <Square 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}    
        />
       );
    }

    
  
    render() {
      return (
        <div className="board">
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  



/* GAME  */


  class Game extends Component {

    constructor(props){
      super(props);
      this.state = {
        history : [{
          squares : Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext : true,
      };
      this.url = "/omegalul.mp3";
      this.audio = new Audio(this.url);
      this.audio.loop = true;
    }
    

    handleClick(i){
      const HISTORY = this.state.history.slice(0, this.state.stepNumber + 1);
      const CURRENT = HISTORY[HISTORY.length - 1];
      const SQUARES = CURRENT.squares.slice();

      if (calculateWinner(SQUARES) || SQUARES[i]) {
        return;
      }

      SQUARES[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history : HISTORY.concat([{
          squares : SQUARES,
        }]),
        stepNumber: HISTORY.length,
        xIsNext: !this.state.xIsNext,
      });
    
    }


    jumpTo(step){
      if(step === 0 ) {
        this.setState({
          history : this.state.history.slice(0 , 1),
        })
      }


      
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }


    render() {
      const HISTORY = this.state.history;
      const CURRENT = HISTORY[this.state.stepNumber];
      const WINNER = calculateWinner(CURRENT.squares);
      const MOVES = HISTORY.map((step , move) => {
        const DESC = move ? 'Ir al turno #' + move : 'Reiniciar juego';
        const btnClass = move ? "btn btn-primary btn-sm" : 'btn btn-secondary btn-sm';

        return (
          <li key = {move}>
            <button className={btnClass} onClick={() => this.jumpTo(move)}>{DESC}</button>
          </li>
        );
      });

      let status;
      
      if (WINNER) {
        status = WINNER;
        //this.audio.play();
      } else {
        status = 'Turno del jugador : ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares = { CURRENT.squares}
              onClick = {(i) => this.handleClick(i)}
             />
          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <ul>{MOVES}</ul>
          </div>
          <audio  src="https://instaud.io/32xs" autoPlay/>
        </div>
      );
    }
  }
  
  // ========================================
  
  function calculateWinner(squares){

    var tie = !squares.includes(null);
    if(tie){
      return ' ¡ EMPATE !';
    }

    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    
    for(let i = 0 ; i < lines.length; i++){
      const[a, b, c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return `Ganador :  ${squares[a]}`;
      }
    }

    return null;
  }


  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  