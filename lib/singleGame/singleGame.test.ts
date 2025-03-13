import { Board, Cell } from '@/server/gameTypes'
import { getEmptyBoard, INITIAL_LIVES, markLives, type Mark, type Point } from './helpers'
import { SingleGame, SingleGameDifficulty } from './singleGame'
import { isDeepStrictEqual } from 'node:util'

const xCell: Cell = { value: 'x', lives: INITIAL_LIVES, winState: false }
const oCell: Cell = { value: 'o', lives: INITIAL_LIVES, winState: false }
const emptyCell: Cell = { value: '-', lives: INITIAL_LIVES, winState: false }

function getCellWithLives(mark: Mark, lives: keyof typeof markLives): Cell {
  return { value: mark, lives, winState: false }
}

test('new Game()', () => {
  const game = new SingleGame('x', 'o', getEmptyBoard(), SingleGameDifficulty.EASY)

  expect(game.getUserMark()).toBe('x')
  expect(game.getComputerMark()).toBe('o')
  const board = game.getBoard()
  board.forEach(row => {
    row.forEach(cell => {
      expect(cell.value).toBe('-')
    })
  })
})

test('game.getBoard', () => {
  const tests: Array<{ expectedBoard: Board }> = [
    { expectedBoard: getEmptyBoard() },
    {
      expectedBoard: [
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, xCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
    },
    {
      expectedBoard: [
        [emptyCell, xCell, emptyCell],
        [emptyCell, oCell, emptyCell],
        [emptyCell, emptyCell, oCell],
      ],
    },
  ]
  tests.forEach(({ expectedBoard }) => {
    const game = new SingleGame('x', 'o', expectedBoard, SingleGameDifficulty.EASY)
    const gameBoard = game.getBoard()
    expect(isDeepStrictEqual(gameBoard, expectedBoard)).toBe(true)
  })
})

test('game.makeComputerMove', () => {
  const tests: Array<{
    initialBoard: Board
    expectedBoard: Board
  }> = [
    {
      initialBoard: [
        [oCell, oCell, emptyCell],
        [emptyCell, xCell, xCell],
        [emptyCell, xCell, emptyCell],
      ],
      expectedBoard: [
        [oCell, oCell, oCell],
        [emptyCell, xCell, xCell],
        [emptyCell, xCell, emptyCell],
      ],
    },
    {
      initialBoard: [
        [oCell, emptyCell, emptyCell],
        [emptyCell, xCell, xCell],
        [emptyCell, emptyCell, emptyCell],
      ],
      expectedBoard: [
        [oCell, emptyCell, emptyCell],
        [oCell, xCell, xCell],
        [emptyCell, emptyCell, emptyCell],
      ],
    },
  ]

  tests.forEach((t, i) => {
    const game = new SingleGame('x', 'o', t.initialBoard, SingleGameDifficulty.EASY)

    game.makeComputerMove()
    const board = game.getBoard()
    expect(isDeepStrictEqual(board, t.expectedBoard)).toBe(true)
  })
})

test('game.makeUserMove', () => {
  const tests: Array<{
    point: Point
    initialBoard: Board
    expectedBoard: Board
    isValidPoint: boolean
  }> = [
    {
      point: [0, 0],
      initialBoard: getEmptyBoard(),
      expectedBoard: [
        [xCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
      isValidPoint: true,
    },
    {
      point: [1, 1],
      initialBoard: getEmptyBoard(),
      expectedBoard: [
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, xCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
      isValidPoint: true,
    },
    {
      point: [2, 2],
      initialBoard: getEmptyBoard(),
      expectedBoard: [
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, xCell],
      ],
      isValidPoint: true,
    },
    {
      point: [0, 0],
      initialBoard: [
        [xCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
      expectedBoard: [
        [xCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
      isValidPoint: false,
    },
  ]

  tests.forEach(t => {
    const game = new SingleGame('x', 'o', t.initialBoard, SingleGameDifficulty.EASY)

    const isValid = game.makeUserMove(t.point)
    expect(isValid).toBe(t.isValidPoint)
    const board = game.getBoard()
    expect(isDeepStrictEqual(board, t.expectedBoard)).toBe(true)
  })
})

test('game.isBoardFull', () => {
  const tests: Array<{ board: Board; expected: boolean }> = [
    {
      board: [
        [xCell, oCell, xCell],
        [xCell, oCell, oCell],
        [oCell, emptyCell, xCell],
      ],
      expected: false,
    },
    {
      board: [
        [xCell, oCell, xCell],
        [xCell, oCell, oCell],
        [oCell, oCell, xCell],
      ],
      expected: true,
    },
  ]
  tests.forEach(({ board, expected }) => {
    const game = new SingleGame('x', 'o', board, SingleGameDifficulty.EASY)
    expect(game.isBoardFull()).toBe(expected)
  })
})

test('game.checkWin', () => {
  const tests: Array<{ board: Board; mark: Mark; expected: boolean }> = [
    {
      board: [
        [xCell, oCell, xCell],
        [xCell, oCell, oCell],
        [oCell, emptyCell, xCell],
      ],
      mark: 'x',
      expected: false,
    },
    {
      board: [
        [xCell, oCell, xCell],
        [emptyCell, oCell, oCell],
        [emptyCell, oCell, xCell],
      ],
      mark: 'o',
      expected: true,
    },
  ]
  tests.forEach(({ board, expected, mark }) => {
    const game = new SingleGame('x', 'o', board, SingleGameDifficulty.EASY)
    expect(game.checkWin(mark)).toBe(expected)
  })
})

test('game.updateLives', () => {
  const tests: Array<{ initialBoard: Board; expected: Board }> = [
    {
      initialBoard: [
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
      expected: [
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
    },
    {
      initialBoard: [
        [getCellWithLives('x', 6), emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
      expected: [
        [getCellWithLives('x', 5), emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
    },
    {
      initialBoard: [
        [getCellWithLives('x', 1), emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
      expected: [
        [getCellWithLives('x', 0), emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell],
      ],
    },
  ]
  tests.forEach(({ initialBoard, expected }) => {
    const game = new SingleGame('x', 'o', initialBoard, SingleGameDifficulty.EASY)
    game.updateLives()
    expect(isDeepStrictEqual(expected, initialBoard)).toBe(true)
  })
})
//=======================================
//=============HELPERS===================
//=======================================
