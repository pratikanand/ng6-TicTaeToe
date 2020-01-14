import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  PLAYER_1 = 'Player 1';
  PLAYER_2 = 'Player 2';

  activePlayer: string;
  gameResultText: string;

  playerInputPositions = [];
  // these combinations results in a winner!
  winningInputPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  gameOver = false;
  isUserPlayingAgainstComputer = false;

  constructor() { }

  initGame() {
    // creating an array having 9 elements marking the 9 positions in the matrix, init all with null values
    for (let i = 0; i < 9; i++) {
      this.playerInputPositions[i] = null;
    }
    this.activePlayer = this.PLAYER_1;
  }

  // this method generates and returns a random index from the null valued positions in the matrix
  generateComputerFeedPosition() {
    const vacantPositions = [];
    this.playerInputPositions.forEach((x, index) => {
      if (x === null) {
        vacantPositions.push(index);
      }
    });
    return vacantPositions.length > 0 ? vacantPositions[Math.round(Math.random() * (vacantPositions.length - 1))] : null;
  }

  onPlayerInput(index: number) {
    // console.log(this.activePlayer);
    if (this.playerInputPositions[index] || this.gameOver) {
      // to prevent overwriting against the 'index' in matrix, if that position is already occupied/defined
      return;
    }
    this.playerInputPositions[index] = this.activePlayer;
    // checking whether game came to end with a winner/draw or not
    const gameResult = this.checkGameResult();
    if (gameResult) {
      // console.log("Game Result: ", this.gameResultText);
      return;
    }
    this.activePlayer = this.activePlayer === this.PLAYER_2 ? this.PLAYER_1 : this.PLAYER_2;
    // conputer as 'player 2' functioanlity starts here
    if (this.isUserPlayingAgainstComputer) {
      const computerFeedIndex = this.generateComputerFeedPosition();
      if (computerFeedIndex !== null) {
        this.playerInputPositions[computerFeedIndex] = this.PLAYER_2;
        const gameResult = this.checkGameResult();
        if (gameResult) {
          // console.log("Game Result: ", this.gameResultText);
          return;
        }
        this.activePlayer = this.PLAYER_1;
      }
      // conputer as 'player 2' functioanlity ends here
    }
    // console.log(this.playerInputPositions);
  }

  checkGameResult() {
    // checking if any of the input types('x' or 'o') satisfies the game winner position criteria
    for (let positionSet of this.winningInputPositions) {
      const isWinner = positionSet.every((v, i, a) => {
        return this.playerInputPositions[v] === this.playerInputPositions[a[0]] && this.playerInputPositions[v];
      })
      if (isWinner) {
        this.gameOver = true;
        // generating text for game result, for binding to template
        if (this.isUserPlayingAgainstComputer && this.playerInputPositions[positionSet[0]] === this.PLAYER_2) {
          this.gameResultText = 'Computer Wins!';
        } else if (this.isUserPlayingAgainstComputer && this.playerInputPositions[positionSet[0]] === this.PLAYER_1) {
          this.gameResultText = 'You Win!';
        } else {
          this.gameResultText = `${this.playerInputPositions[positionSet[0]]} Wins!`;
        }
        return true;
      }
    }
    // checking for a tie
    if (this.playerInputPositions.every(c => c !== null)) {
      this.gameOver = true;
      this.gameResultText = 'It\'s a Tie!';
      return true;
    }
    return false;
  }

  resetGame() {
    this.playerInputPositions = [];
    this.activePlayer = null;
    this.gameOver = false;
    this.gameResultText = null;
  }
}
