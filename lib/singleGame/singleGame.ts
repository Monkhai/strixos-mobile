import * as readline from 'node:readline'
import { getComputerMark, getEmptyBoard, getPoint, getUserMarkIO, INITIAL_LIVES, type Point } from './helpers'
import { Board, Mark } from '@/server/gameTypes'

export class SingleGame {
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
    this.board[row][col] = { value: mark, winState: false, lives: INITIAL_LIVES }
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
    return this.board[row][col].value === '-'
  }

  // ✓
  isBoardFull() {
    return this.board.every(row => row.every(cell => cell.value !== '-'))
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
        if (cell.value !== '-') {
          cell.lives -= 1
          if (cell.lives < 0) {
            this.board[row][col] = { value: '-', winState: false, lives: INITIAL_LIVES }
          }
        }
      }
    }
  }

  printBoard() {
    this.board
      .map(row =>
        row
          .map(cell => {
            if (!cell) return '-'
            return cell.lives === 1 ? `\x1b[31m${cell.value}\x1b[0m` : cell.value
          })
          .join(' ')
      )
      .join('\n')
  }

  private checkRowWin(mark: Mark) {
    for (let row = 0; row < 3; row++) {
      if (this.board[row].every(cell => cell && cell.value === mark)) {
        return true
      }
    }
    return false
  }

  private checkColWin(mark: Mark) {
    for (let col = 0; col < 3; col++) {
      if (this.board[0][col]?.value === mark && this.board[1][col]?.value === mark && this.board[2][col]?.value === mark) {
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
      this.board[0][0].value === mark &&
      this.board[1][1].value === mark &&
      this.board[2][2].value === mark
    ) {
      return true
    }
    if (
      this.board[0][2] &&
      this.board[1][1] &&
      this.board[2][0] &&
      this.board[0][2].value === mark &&
      this.board[1][1].value === mark &&
      this.board[2][0].value === mark
    ) {
      return true
    }
    return false
  }

  private getAvailablePoints(): Array<Point> {
    const points: Array<Point> = []
    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.value === '-') {
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
      if (rowMarks.filter(cell => cell && cell.value === this.computerMark).length === 2) {
        return [row, col]
      }

      // Check column
      const colMarks = [this.board[0][col], this.board[1][col], this.board[2][col]]
      if (colMarks.filter(cell => cell && cell.value === this.computerMark).length === 2) {
        return [row, col]
      }

      // Check diagonals if applicable
      if (row === col) {
        const diag1 = [this.board[0][0], this.board[1][1], this.board[2][2]]
        if (diag1.filter(cell => cell && cell.value === this.computerMark).length === 2) {
          return [row, col]
        }
      }

      if (row + col === 2) {
        const diag2 = [this.board[0][2], this.board[1][1], this.board[2][0]]
        if (diag2.filter(cell => cell && cell.value === this.computerMark).length === 2) {
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
      if (rowMarks.filter(cell => cell && cell.value === this.userMark).length === 2 && rowMarks.some(cell => cell.value === '-')) {
        return [row, col]
      }

      // Check column
      const colMarks = [this.board[0][col], this.board[1][col], this.board[2][col]]
      if (colMarks.filter(cell => cell && cell.value === this.userMark).length === 2) {
        return [row, col]
      }

      // Check diagonals if applicable
      if (row === col) {
        const diag1 = [this.board[0][0], this.board[1][1], this.board[2][2]]
        if (diag1.filter(cell => cell && cell.value === this.userMark).length === 2) {
          return [row, col]
        }
      }

      if (row + col === 2) {
        const diag2 = [this.board[0][2], this.board[1][1], this.board[2][0]]
        if (diag2.filter(cell => cell && cell.value === this.userMark).length === 2) {
          return [row, col]
        }
      }
    }

    return null
  }
}
