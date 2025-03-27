import { Board, Mark } from '@/server/gameTypes'
import { checkWin, getAvailablePoints, getUpdatedBoard, INITIAL_LIVES, isBoardEmpty, isBoardFull, minMax, type Point } from './helpers'

export enum SingleGameDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
}
export class SingleGame {
  private userMark: Mark
  private computerMark: Mark
  private board: Board
  private difficulty: SingleGameDifficulty
  private computerMoves: Record<SingleGameDifficulty, () => void> = {
    [SingleGameDifficulty.EASY]: this.makeEasyComputerMove,
    [SingleGameDifficulty.MEDIUM]: this.makeMediumComputerMove,
  }

  constructor(userMark: Mark, computerMark: Mark, board: Board, difficulty: SingleGameDifficulty) {
    this.userMark = userMark
    this.computerMark = computerMark
    this.board = board
    this.difficulty = difficulty
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
    // get the computer move function based on the difficulty
    const computerMoveFn = this.computerMoves[this.difficulty].bind(this)
    computerMoveFn()
  }

  private makeEasyComputerMove() {
    const availablePoints = this.getAvailablePoints()
    const randomIndex = Math.floor(Math.random() * availablePoints.length)
    const randomPoint = availablePoints[randomIndex]
    this.makeMove(this.computerMark, randomPoint)
  }

  private makeMediumComputerMove() {
    if (isBoardEmpty(this.board)) {
      const availablePoints = this.getAvailablePoints()
      const randomIndex = Math.floor(Math.random() * availablePoints.length)
      const randomPoint = availablePoints[randomIndex]
      this.makeMove(this.computerMark, randomPoint)
      return
    }

    const scoreList = new Map<Point, number>()

    const points = getAvailablePoints(this.board)
    points.forEach(point => {
      scoreList.set(point, 0)
    })

    points.forEach(point => {
      const newBoard = getUpdatedBoard(this.board, point, this.computerMark)
      // for as in wins are positive and loses are negative
      const score = minMax(newBoard, this.computerMark, 'for')
      const curr = scoreList.get(point) ?? 0
      scoreList.set(point, curr + score)
    })

    // find the point with the largest score
    let maxScore = -Infinity
    let bestPoint: Point | undefined

    scoreList.forEach((score, point) => {
      if (score > maxScore) {
        maxScore = score
        bestPoint = point
      }
    })

    // Ensure that a point is returned. There should always be one, so throw an error if not.
    if (bestPoint === undefined) {
      throw new Error('Expected at least one point in scoreList, but found none.')
    }

    this.makeMove(this.computerMark, bestPoint)
  }

  // ✓
  private isPointValid(point: Point) {
    const [row, col] = point
    return this.board[row][col].value === '-'
  }

  // ✓
  isBoardFull() {
    return isBoardFull(this.board)
  }

  // ✓
  checkWin(mark: Mark) {
    return checkWin(this.board, mark)
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

  private getAvailablePoints(): Array<Point> {
    return getAvailablePoints(this.board)
  }

  private findComputerWin(): Point | null {
    const availablePoints = this.getAvailablePoints()

    for (const [row, col] of availablePoints) {
      // Check row
      const rowMarks = this.board[row]
      if (rowMarks.filter(cell => cell && cell.value === this.computerMark).length === 2) {
        if (this.difficulty === SingleGameDifficulty.EASY) {
          return [row, col]
        }
        // check lives to ensure that next move is still a win
        if (rowMarks.every(cell => cell && cell.lives > 0)) {
          return [row, col]
        }
      }

      // Check column
      const colMarks = [this.board[0][col], this.board[1][col], this.board[2][col]]
      if (colMarks.filter(cell => cell && cell.value === this.computerMark).length === 2) {
        if (this.difficulty === SingleGameDifficulty.EASY) {
          return [row, col]
        }
        if (colMarks.every(cell => cell && cell.lives > 0)) {
          return [row, col]
        }
      }

      // Check diagonals if applicable
      if (row === col) {
        const diag1 = [this.board[0][0], this.board[1][1], this.board[2][2]]
        if (diag1.filter(cell => cell && cell.value === this.computerMark).length === 2) {
          if (this.difficulty === SingleGameDifficulty.EASY) {
            return [row, col]
          }
          if (diag1.every(cell => cell && cell.lives > 0)) {
            return [row, col]
          }
        }
      }

      if (row + col === 2) {
        const diag2 = [this.board[0][2], this.board[1][1], this.board[2][0]]
        if (diag2.filter(cell => cell && cell.value === this.computerMark).length === 2) {
          if (this.difficulty === SingleGameDifficulty.EASY) {
            return [row, col]
          }
          if (diag2.every(cell => cell && cell.lives > 0)) {
            return [row, col]
          }
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
        if (this.difficulty === SingleGameDifficulty.EASY) {
          return [row, col]
        }
        if (rowMarks.every(cell => cell && cell.lives > 0)) {
          return [row, col]
        }
      }

      // Check column
      const colMarks = [this.board[0][col], this.board[1][col], this.board[2][col]]
      if (colMarks.filter(cell => cell && cell.value === this.userMark).length === 2) {
        if (this.difficulty === SingleGameDifficulty.EASY) {
          return [row, col]
        }
        if (colMarks.every(cell => cell && cell.lives > 0)) {
          return [row, col]
        }
      }

      // Check diagonals if applicable
      if (row === col) {
        const diag1 = [this.board[0][0], this.board[1][1], this.board[2][2]]
        if (diag1.filter(cell => cell && cell.value === this.userMark).length === 2) {
          if (this.difficulty === SingleGameDifficulty.EASY) {
            return [row, col]
          }
          if (diag1.every(cell => cell && cell.lives > 0)) {
            return [row, col]
          }
        }
      }

      if (row + col === 2) {
        const diag2 = [this.board[0][2], this.board[1][1], this.board[2][0]]
        if (diag2.filter(cell => cell && cell.value === this.userMark).length === 2) {
          if (this.difficulty === SingleGameDifficulty.EASY) {
            return [row, col]
          }
          if (diag2.every(cell => cell && cell.lives > 0)) {
            return [row, col]
          }
        }
      }
    }

    return null
  }
}
