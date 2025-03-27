import { Board, Cell, Row } from '@/server/gameTypes'
import * as readline from 'node:readline'

export type Tilt = 'for' | 'against'

export const markLives = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
}
export const INITIAL_LIVES = 6
export type Mark = 'x' | 'o'

export const X = 'x' as Mark
export const O = 'o' as Mark

export type ValidIndex = 0 | 1 | 2

type RowPoint = ValidIndex
type ColPoint = ValidIndex
export type Point = [RowPoint, ColPoint]

export function getEmptyBoard(): Board {
  return [
    [
      { value: '-', winState: false, lives: INITIAL_LIVES },
      { value: '-', winState: false, lives: INITIAL_LIVES },
      { value: '-', winState: false, lives: INITIAL_LIVES },
    ],
    [
      { value: '-', winState: false, lives: INITIAL_LIVES },
      { value: '-', winState: false, lives: INITIAL_LIVES },
      { value: '-', winState: false, lives: INITIAL_LIVES },
    ],
    [
      { value: '-', winState: false, lives: INITIAL_LIVES },
      { value: '-', winState: false, lives: INITIAL_LIVES },
      { value: '-', winState: false, lives: INITIAL_LIVES },
    ],
  ]
}

async function getRowOrCol(rl: readline.Interface, msg: 'Row' | 'Col', count = 0): Promise<ValidIndex> {
  const row = await new Promise<ValidIndex>((resolve, reject) => {
    rl.question(`${msg}: `, index => {
      const parsedIndex = parseInt(index)
      if (!isValidIndex(parsedIndex)) {
        if (count < 3) {
          return getRowOrCol(rl, msg, count + 1)
        } else {
          reject(new Error('Invalid row index'))
        }
      } else {
        resolve((parsedIndex - 1) as ValidIndex)
      }
    })
  })
  return row
}

export async function getPoint(rl: readline.Interface): Promise<Point> {
  const row = await getRowOrCol(rl, 'Row')
  const col = await getRowOrCol(rl, 'Col')
  return [row, col]
}

function isValidIndex(index: number): boolean {
  return index === 1 || index === 2 || index === 3
}

export function getComputerMark(userMark: Mark): Mark {
  switch (userMark) {
    case 'o':
      return 'x'
    case 'x':
      return 'o'
  }
}

export async function getUserMarkIO(rl: readline.Interface, count = 0): Promise<Mark> {
  return await new Promise<Mark>((resolve, reject) => {
    rl.question('Choose player (x | o): ', line => {
      if (line !== 'x' && line !== 'o') {
        if (count < 3) {
          const mark = getUserMarkIO(rl, count + 1)
          resolve(mark)
        } else {
          reject()
        }
      }
      resolve(line as Mark)
    })
  })
}

export function formatBoard(board: Board): string {
  return board.map(row => row.map(cell => (cell === null ? '-' : cell.value)).join(' | ')).join('\n---------\n')
}

export function sleep(seconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

export function checkWin(board: Board, mark: Mark) {
  const rowWin = checkRowWin(board, mark)
  const colWin = checkColWin(board, mark)
  const diagWin = checkDiagonalWin(board, mark)
  return rowWin || colWin || diagWin
}

export function checkRowWin(board: Board, mark: Mark) {
  for (let row = 0; row < 3; row++) {
    const rowMarks = board[row]
    if (rowMarks.every(cell => cell && cell.value === mark)) {
      if (rowMarks.every(cell => cell && cell.lives > 0)) {
        return true
      }
    }
  }
  return false
}

export function checkColWin(board: Board, mark: Mark) {
  for (let col = 0; col < 3; col++) {
    const colMarks = board.map(row => row[col])
    if (colMarks.every(cell => cell && cell.value === mark)) {
      if (colMarks.every(cell => cell && cell.lives > 0)) {
        return true
      }
    }
  }
  return false
}

export function checkDiagonalWin(board: Board, mark: Mark) {
  const diag1 = [board[0][0], board[1][1], board[2][2]]
  const diag2 = [board[0][2], board[1][1], board[2][0]]
  if (diag1.every(cell => cell && cell.value === mark)) {
    if (diag1.every(cell => cell && cell.lives > 0)) {
      return true
    }
  }
  if (diag2.every(cell => cell && cell.value === mark)) {
    if (diag2.every(cell => cell && cell.lives > 0)) {
      return true
    }
  }
  return false
}

export function isBoardFull(board: Board) {
  return board.every(row => row.every(cell => cell.value !== '-'))
}

export function getAvailablePoints(board: Board) {
  const points: Array<Point> = []
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.value === '-') {
        const point: Point = [rowIndex, colIndex] as Point
        points.push(point)
      }
    })
  })
  return points
}

export function getUpdatedBoard(board: Board, point: Point, mark: Mark) {
  let newBoard: Board = JSON.parse(JSON.stringify(board))
  const [row, col] = point
  newBoard[row][col] = { value: mark, winState: false, lives: INITIAL_LIVES }
  return newBoard
}

export function minMax(board: Board, mark: Mark, tilt: Tilt): number {
  let score = 0
  if (isBoardFull(board)) {
    return 0
  }
  if (checkWin(board, mark)) {
    if (tilt === 'for') {
      return 1
    } else {
      return -1
    }
  }

  const points = getAvailablePoints(board)
  points.forEach(point => {
    const newMark: Mark = mark === 'o' ? 'x' : 'o'
    let newBoard: Board = getUpdatedBoard(board, point, newMark)
    newBoard = decrementLives(newBoard)
    const newTilt: Tilt = tilt === 'for' ? 'against' : 'for'
    score += minMax(newBoard, newMark, newTilt)
  })

  return score
}

function decrementLives(board: Board): Board {
  return board.map(row => row.map(cell => ({ ...cell, lives: cell.lives - 1 }))) as Board
}

export function isBoardEmpty(board: Board) {
  return board.every(row => row.every(cell => cell.value === '-'))
}
