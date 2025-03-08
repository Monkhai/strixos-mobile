import * as readline from 'node:readline'

export const markLives = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
}
export const INITIAL_LIVES = 7
export type Mark = 'x' | 'o'

export const X = 'x' as Mark
export const O = 'o' as Mark

export type Cell = { mark: Mark; lives: number } | null
export type Row = [Cell, Cell, Cell]
export type Board = [Row, Row, Row]

export type ValidIndex = 0 | 1 | 2

type RowPoint = ValidIndex
type ColPoint = ValidIndex
export type Point = [RowPoint, ColPoint]

export function getEmptyBoard(): Board {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
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
          console.log('you chose a wrong mark. please choose either an x or o.')
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
  return board.map(row => row.map(cell => (cell === null ? '-' : cell.mark)).join(' | ')).join('\n---------\n')
}
