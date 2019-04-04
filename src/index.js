import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if (props.highlight) {
    return (
      <button
        className="squareBlue"
        onClick={props.onClick}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button
        className="square"
        onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        highlight={this.props.highlights.includes(i)}
      />);
  }

  render() {
    let rows = []
    for (let j = 0; j < 3; j++) {
      let cells = [];
      for (let i = 0; i < 3; i++) {
        cells.push(this.renderSquare(j * 3 + i))
      }
      rows.push(
        <div className="board-row" key={j}>
          {cells}
        </div>
      )
    }

    return (
      <div>
        <div className="status">{/*status*/}</div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          pos: []
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      boldIndex: -1,
      reverse: false
    };
  }


  boldTo(move) {
    this.setState({ boldIndex: move })
  }

  unboldTo() {
    this.setState({ boldIndex: -1 })
  }

  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc = move ?
        'Go to move #' + move + '(' + step.pos[0] + ',' + step.pos[1] + ')' :
        'Go to game start';

      if (this.state.boldIndex === move) {
        desc = (<b>{desc}</b>)
      }

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            onMouseEnter={() => this.boldTo(move)}
            onMouseLeave={() => this.unboldTo()}
          >
            {desc}
          </button>
        </li>
      );
    });

    if(this.state.reverse) {
      moves.reverse()
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
      console.log(this.hs)
    } else if(history.length === 10) {
      status = 'Game Over! Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      console.log("next:" + this.state.xIsNext + ", " + status)
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlights={this.hs} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button
              onClick={() => { this.setState({ reverse: !this.state.reverse }) }}
            >
              Sort</button>
          </div>
          <ol reversed={this.state.reverse}>{moves}</ol>
        </div>
      </div>
    );
  }

  handleClick(i) {
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    let current = history[history.length - 1];
    let squares = current.squares.slice()
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'

    let position = []
    position.push(Math.floor(i / 3))
    position.push(i % 3)

    this.setState({
      history: history.concat([{ squares: squares, pos: position }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        this.hs = [a, b, c]
        return squares[a];
      }
    }
    this.hs = []
    return null;
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


