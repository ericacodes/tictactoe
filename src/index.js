import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let squares = [];
    for (let i = 0; i < 3; i++) {
      console.log(squares);
      squares.push(
        <div key={i} className="board-row">
          {this.renderSquare(0 + i * 3)}
          {this.renderSquare(1 + i * 3)}
          {this.renderSquare(2 + i * 3)}
        </div>
      );
    }

    return (
      <div>
        {squares}
        {/* <div className="board-row">
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
        </div> */}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // an array of objects each with a "squares" property holding an array that corresponds to the board at a given moment
      history: [{ squares: Array(9).fill(null), index: null }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // an object with a "squares" property holding an array that corresponds to the board at a specific moment
    const current = history[history.length - 1];
    // copy of the array that corresponds to the board at a specific moment
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      // if someone has won or if the spot is already taken
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      // concat one array with another. Each array contains objects with a "squares" property
      history: history.concat([
        {
          squares: squares,
          index: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  findLocation(index) {
    const position = {
      0: "(1, 1)",
      1: "(1, 2)",
      2: "(1, 3)",
      3: "(2, 1)",
      4: "(2, 2)",
      5: "(2, 3)",
      6: "(3, 1)",
      7: "(3, 2)",
      8: "(3, 3)",
    };
    return position[index.toString()];
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + ` @${this.findLocation(step.index)}`
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={move === this.state.stepNumber ? { fontWeight: "bold" } : {}}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}
