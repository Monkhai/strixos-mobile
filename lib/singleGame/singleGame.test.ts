import { getEmptyBoard, INITIAL_LIVES, markLives, type Board, type Cell, type Mark, type Point } from './helpers'
import { SingleGame } from './singleGame'
import { isDeepStrictEqual } from 'node:util'

const xCell: Cell = { mark: 'x', lives: INITIAL_LIVES }
const oCell: Cell = { mark: 'o', lives: INITIAL_LIVES }

function getCellWithLives(mark: Mark, lives: keyof typeof markLives): Cell {
  return { lives, mark }
}

test('new Game()', () => {
  const game = new SingleGame('x', 'o', getEmptyBoard())

  expect(game.getUserMark()).toBe('x')
  expect(game.getComputerMark()).toBe('o')
  const board = game.getBoard()
  board.forEach(row => {
    row.forEach(cell => {
      expect(cell).toBe(null)
    })
  })
})

test('game.getBoard', () => {
  const tests: Array<{ expectedBoard: Board }> = [
    { expectedBoard: getEmptyBoard() },
    {
      expectedBoard: [
        [null, null, null],
        [null, { mark: 'x', lives: 3 }, null],
        [null, null, null],
      ],
    },
    {
      expectedBoard: [
        [null, { mark: 'x', lives: 3 }, null],
        [null, { mark: 'o', lives: 3 }, null],
        [null, null, { mark: 'o', lives: 3 }],
      ],
    },
  ]
  tests.forEach(({ expectedBoard }) => {
    const game = new SingleGame('x', 'o', expectedBoard)
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
        [oCell, oCell, null],
        [null, xCell, xCell],
        [null, xCell, null],
      ],
      expectedBoard: [
        [oCell, oCell, oCell],
        [null, xCell, xCell],
        [null, xCell, null],
      ],
    },
    {
      initialBoard: [
        [oCell, null, null],
        [null, xCell, xCell],
        [null, null, null],
      ],
      expectedBoard: [
        [oCell, null, null],
        [oCell, xCell, xCell],
        [null, null, null],
      ],
    },
  ]

  tests.forEach((t, i) => {
    const game = new SingleGame('x', 'o', t.initialBoard)

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
        [xCell, null, null],
        [null, null, null],
        [null, null, null],
      ],
      isValidPoint: true,
    },
    {
      point: [1, 1],
      initialBoard: getEmptyBoard(),
      expectedBoard: [
        [null, null, null],
        [null, xCell, null],
        [null, null, null],
      ],
      isValidPoint: true,
    },
    {
      point: [2, 2],
      initialBoard: getEmptyBoard(),
      expectedBoard: [
        [null, null, null],
        [null, null, null],
        [null, null, xCell],
      ],
      isValidPoint: true,
    },
    {
      point: [0, 0],
      initialBoard: [
        [xCell, null, null],
        [null, null, null],
        [null, null, null],
      ],
      expectedBoard: [
        [xCell, null, null],
        [null, null, null],
        [null, null, null],
      ],
      isValidPoint: false,
    },
  ]

  tests.forEach(t => {
    const game = new SingleGame('x', 'o', t.initialBoard)

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
        [oCell, null, xCell],
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
    const game = new SingleGame('x', 'o', board)
    expect(game.isBoardFull()).toBe(expected)
  })
})

test('game.checkWin', () => {
  const tests: Array<{ board: Board; mark: Mark; expected: boolean }> = [
    {
      board: [
        [xCell, oCell, xCell],
        [xCell, oCell, oCell],
        [oCell, null, xCell],
      ],
      mark: 'x',
      expected: false,
    },
    {
      board: [
        [xCell, oCell, xCell],
        [null, oCell, oCell],
        [null, oCell, xCell],
      ],
      mark: 'o',
      expected: true,
    },
  ]
  tests.forEach(({ board, expected, mark }) => {
    const game = new SingleGame('x', 'o', board)
    expect(game.checkWin(mark)).toBe(expected)
  })
})

test('game.updateLives', () => {
  const tests: Array<{ initialBoard: Board; expected: Board }> = [
    {
      initialBoard: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      expected: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
    },
    {
      initialBoard: [
        [getCellWithLives('x', 7), null, null],
        [null, null, null],
        [null, null, null],
      ],
      expected: [
        [getCellWithLives('x', 6), null, null],
        [null, null, null],
        [null, null, null],
      ],
    },
    {
      initialBoard: [
        [getCellWithLives('x', 1), null, null],
        [null, null, null],
        [null, null, null],
      ],
      expected: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
    },
  ]
  tests.forEach(({ initialBoard, expected }) => {
    const game = new SingleGame('x', 'o', initialBoard)
    game.updateLives()
    expect(isDeepStrictEqual(expected, initialBoard)).toBe(true)
  })
})
//=======================================
//=============HELPERS===================
//=======================================
