import * as readline from 'node:readline'
import { getComputerMark, getEmptyBoard, getPoint, getUserMarkIO, INITIAL_LIVES, type Board, type Mark, type Point } from './helpers'

export class Game {
  private userMark: Mark
  private computerMark: Mark
  private board: Board

  constructor(userMark: Mark, computerMark: Mark, board: Board) {
    this.userMark = userMark
    this.computerMark = computerMark
    this.board = board
  }

  // ✓
  getUserMark() {
    return this.userMark
  }

  // ✓
  getComputerMark() {
    return this.computerMark
  }

  // ✓
  getBoard() {
    return this.board
  }

  // ✓
  private makeMove(mark: Mark, point: Point): boolean {
    if (!this.isPointValid(point)) {
      return false
    }
    const [row, col] = point
    this.board[row][col] = { mark, lives: INITIAL_LIVES }
    return true
  }

  // ✓
  makeUserMove(point: Point): boolean {
    return this.makeMove(this.userMark, point)
  }

  // ✓
  makeComputerMove() {
    const winPoint = this.findComputerWin()
    if (winPoint) {
      this.makeMove(this.computerMark, winPoint)
      return
    }
    const blockUserPoint = this.canBlockUser()
    if (blockUserPoint) {
      this.makeMove(this.computerMark, blockUserPoint)
      return
    }
    const availablePoints = this.getAvailablePoints()
    const randomIndex = Math.floor(Math.random() * availablePoints.length)
    const randomPoint = availablePoints[randomIndex]
    this.makeMove(this.computerMark, randomPoint)
  }

  // ✓
  private isPointValid(point: Point) {
    const [row, col] = point
    return this.board[row][col] === null
  }

  // ✓
  isBoardFull() {
    return this.board.every(row => row.every(cell => cell !== null))
  }

  // ✓
  checkWin(mark: Mark) {
    const rowWin = this.checkRowWin(mark)
    const colWin = this.checkColWin(mark)
    const diagWin = this.checkDiagonalWin(mark)
    return rowWin || colWin || diagWin
  }

  // ✓
  updateLives() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cell = this.board[row][col]
        if (cell) {
          cell.lives -= 1
          if (cell.lives <= 0) {
            this.board[row][col] = null
          }
        }
      }
    }
  }

  printBoard() {
    console.log(
      this.board
        .map(row =>
          row
            .map(cell => {
              if (!cell) return '-'
              return cell.lives === 1 ? `\x1b[31m${cell.mark}\x1b[0m` : cell.mark
            })
            .join(' ')
        )
        .join('\n')
    )
  }

  private checkRowWin(mark: Mark) {
    for (let row = 0; row < 3; row++) {
      if (this.board[row].every(cell => cell && cell.mark === mark)) {
        return true
      }
    }
    return false
  }

  private checkColWin(mark: Mark) {
    for (let col = 0; col < 3; col++) {
      if (this.board[0][col]?.mark === mark && this.board[1][col]?.mark === mark && this.board[2][col]?.mark === mark) {
        return true
      }
    }
    return false
  }

  private checkDiagonalWin(mark: Mark) {
    if (
      this.board[0][0] &&
      this.board[1][1] &&
      this.board[2][2] &&
      this.board[0][0].mark === mark &&
      this.board[1][1].mark === mark &&
      this.board[2][2].mark === mark
    ) {
      return true
    }
    if (
      this.board[0][2] &&
      this.board[1][1] &&
      this.board[2][0] &&
      this.board[0][2].mark === mark &&
      this.board[1][1].mark === mark &&
      this.board[2][0].mark === mark
    ) {
      return true
    }
    return false
  }

  private getAvailablePoints(): Array<Point> {
    const points: Array<Point> = []
    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          const point: Point = [rowIndex, colIndex] as Point
          points.push(point)
        }
      })
    })
    return points
  }

  private findComputerWin(): Point | null {
    const availablePoints = this.getAvailablePoints()

    for (const [row, col] of availablePoints) {
      // Check row
      const rowMarks = this.board[row]
      if (rowMarks.filter(cell => cell && cell.mark === this.computerMark).length === 2) {
        return [row, col]
      }

      // Check column
      const colMarks = [this.board[0][col], this.board[1][col], this.board[2][col]]
      if (colMarks.filter(cell => cell && cell.mark === this.computerMark).length === 2) {
        return [row, col]
      }

      // Check diagonals if applicable
      if (row === col) {
        const diag1 = [this.board[0][0], this.board[1][1], this.board[2][2]]
        if (diag1.filter(cell => cell && cell.mark === this.computerMark).length === 2) {
          return [row, col]
        }
      }

      if (row + col === 2) {
        const diag2 = [this.board[0][2], this.board[1][1], this.board[2][0]]
        if (diag2.filter(cell => cell && cell.mark === this.computerMark).length === 2) {
          return [row, col]
        }
      }
    }

    return null
  }

  private canBlockUser(): Point | null {
    const availablePoints = this.getAvailablePoints()

    for (const [row, col] of availablePoints) {
      // Check row
      const rowMarks = this.board[row]
      if (rowMarks.filter(cell => cell && cell.mark === this.userMark).length === 2 && rowMarks.includes(null)) {
        return [row, col]
      }

      // Check column
      const colMarks = [this.board[0][col], this.board[1][col], this.board[2][col]]
      if (colMarks.filter(cell => cell && cell.mark === this.userMark).length === 2) {
        return [row, col]
      }

      // Check diagonals if applicable
      if (row === col) {
        const diag1 = [this.board[0][0], this.board[1][1], this.board[2][2]]
        if (diag1.filter(cell => cell && cell.mark === this.userMark).length === 2) {
          return [row, col]
        }
      }

      if (row + col === 2) {
        const diag2 = [this.board[0][2], this.board[1][1], this.board[2][0]]
        if (diag2.filter(cell => cell && cell.mark === this.userMark).length === 2) {
          return [row, col]
        }
      }
    }

    return null
  }
}

async function gameLoop() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  let userMark: Mark
  userMark = await getUserMarkIO(rl)
  const computerMark = getComputerMark(userMark)

  const game = new Game(userMark, computerMark, getEmptyBoard())
  while (true) {
    game.printBoard()
    // show board state
    // get user input
    let point: Point = await getPoint(rl)
    //make move
    let isValid = false
    while (!isValid) {
      isValid = game.makeUserMove(point)
      if (!isValid) {
        console.log('this move is not valid broseph')
      }
    }
    game.updateLives()
    // check if user won
    const userWon = game.checkWin(userMark)
    // // if yes, break
    if (userWon) {
      game.printBoard()
      console.log('You have won!!')
      break
    }

    // check if board is full
    if (game.isBoardFull()) {
      game.printBoard()
      console.log('game over. board is full')
      break
    }

    game.printBoard()
    console.log('computer is thinking...')
    await sleep(1)

    // make computer move
    game.makeComputerMove()
    game.updateLives()
    // check if computer won
    const computerWon = game.checkWin(computerMark)
    // // if yes, break
    if (computerWon) {
      game.printBoard()
      console.log('you have lost! loser!')
      break
    }
    // check if draw (board full)
    const isDraw = game.isBoardFull()
    // // if yes, break
    if (isDraw) {
      console.log('yoy managed to not win but also not lose. that is sad')
      break
    }
  }
  rl.close()
}

// gameLoop().catch(err => {
//   console.error('Game error:', err)
//   process.exit(1)
// })

function sleep(seconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}
