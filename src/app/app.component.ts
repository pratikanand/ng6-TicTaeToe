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
    for (let i = 0; i < 9; i++) {
      this.playerInputPositions[i] = null;
    }
    this.activePlayer = this.PLAYER_1;
  }

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
    console.log(this.activePlayer);
    if (this.playerInputPositions[index] || this.gameOver) {
      return;
    }
    this.playerInputPositions[index] = this.activePlayer;
    const gameResult = this.checkGameResult();
    if (gameResult) {
      console.log("Game Result: ", this.gameResultText);
      return;
    }
    this.activePlayer = this.activePlayer === this.PLAYER_2 ? this.PLAYER_1 : this.PLAYER_2;
    if (this.isUserPlayingAgainstComputer) {
      const computerFeedIndex = this.generateComputerFeedPosition();
      if (computerFeedIndex !== null) {
        this.playerInputPositions[computerFeedIndex] = this.PLAYER_2;
        const gameResult = this.checkGameResult();
        if (gameResult) {
          console.log("Game Result: ", this.gameResultText);
          return;
        }
        this.activePlayer = this.PLAYER_1;
      }
    }
    console.log(this.playerInputPositions);
  }

  checkGameResult() {
    for (let positionSet of this.winningInputPositions) {
      const isWinner = positionSet.every((v, i, a) => {
        return this.playerInputPositions[v] === this.playerInputPositions[a[0]] && this.playerInputPositions[v];
      })
      if (isWinner) {
        this.gameOver = true;
        this.gameResultText = this.playerInputPositions[positionSet[0]] === this.PLAYER_2 && this.isUserPlayingAgainstComputer ? 'Computer Wins!' : (this.playerInputPositions[positionSet[0]] === this.PLAYER_1 && this.isUserPlayingAgainstComputer ? 'You Win!' : `${this.playerInputPositions[positionSet[0]]} Wins!`);
        return true;
      }
    }
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
