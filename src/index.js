import React from "react";
import ReactDOM from "react-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let squares = [];

    for (let i = 0; i < 3; i++) {
      let column = [];
      for (let j = 0; j < 3; j++) {
        column.push(this.renderSquare(i * 3 + j));
      }
      squares.push(
        <div key={i} className="board-row">
          {column}
        </div>
      );
    }

    return <div>{squares}</div>;
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
      isChecked: false,
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

  handleCheck() {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  }

  render() {
    const history = this.state.history;
    console.log(history);
    // const useHistory = this.state.isChecked ? history.reverse() : history;
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

    let status = winner
      ? "Winner: " + winner
      : "Next player: " + (this.state.xIsNext ? "X" : "O");

    let checkboxMessage = this.state.isChecked
      ? "Switch to acending order"
      : "Swith to descending order";

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
          <FormControlLabel
            checked={this.state.isChecked}
            onChange={() => this.handleCheck()}
            control={<Checkbox name="checked" color="black" />}
            label={checkboxMessage}
          />
          <ol>{this.state.isChecked ? moves.reverse() : moves}</ol>
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
