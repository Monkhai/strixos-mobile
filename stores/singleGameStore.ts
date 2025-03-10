import { Point, sleep, ValidIndex } from '@/lib/singleGame/helpers'
import { SingleGame } from '@/lib/singleGame/singleGame'
import { Board, Mark } from '@/server/gameTypes'
import { getEmptyBoard } from '@/Views/GameView/components/Board/utils'
import { create } from 'zustand'

export enum SingleGameState {
  PLAYING = 'playing',
  FINISHED = 'finished',
  NONE = 'none',
}

export enum Player {
  USER = 'user',
  COMPUTER = 'computer',
}

interface StoreType {
  game: SingleGame | null
  mark: Mark | 'unknown'
  activePlayer: Player | null
  gameState: SingleGameState
  board: Board
  gameWinner: Player | null

  newGame: (userMark: Mark) => void
  playTurn: (row: number, col: number) => Promise<void>
  resetAllStates: () => void
}

export const useSingleGameStore = create<StoreType>()((set, get) => ({
  game: null,
  mark: 'unknown',
  activePlayer: null,
  gameState: SingleGameState.NONE,
  board: getEmptyBoard(),
  gameWinner: null,

  //--------------------------------------
  //----------------Actions---------------
  //--------------------------------------
  async newGame(userMark: Mark) {
    get().resetAllStates()
    const computerMark: Mark = userMark === 'o' ? 'x' : 'o'
    const game = new SingleGame(userMark, computerMark, getEmptyBoard())
    const players = [Player.USER, Player.COMPUTER]
    const activePlayer = players[Math.floor(Math.random() * players.length)]
    set({ game, gameState: SingleGameState.PLAYING, activePlayer, mark: userMark })
    if (activePlayer === Player.COMPUTER) {
      await sleep(1)
      game.makeComputerMove()
      game.updateLives()
      set({ board: game.getBoard(), activePlayer: Player.USER })
    }
  },
  //--------------------------------------
  //--------------------------------------
  async playTurn(row: number, col: number): Promise<void> {
    const game = get().game

    if (!game) {
      return Promise.resolve()
    }

    set({ activePlayer: Player.USER })

    const point: Point = [row as ValidIndex, col as ValidIndex]

    //make move
    const isValid = game.makeUserMove(point)
    if (!isValid) {
      return
    }
    game.updateLives()
    set({ board: game.getBoard() })
    // check if user won
    const userWon = game.checkWin(game.getUserMark())
    // // if yes, break
    if (userWon) {
      set({ gameState: SingleGameState.FINISHED, gameWinner: Player.USER })
      return
    }

    // check if board is full
    if (game.isBoardFull()) {
      set({ gameState: SingleGameState.FINISHED })
      return
    }

    // switch to computer
    set({ activePlayer: Player.COMPUTER })
    // sleep for 1 second to simulate computer thinking
    await sleep(1)

    // make computer move
    game.makeComputerMove()
    // update lives
    game.updateLives()
    // update board
    set({ board: game.getBoard() })
    // check if computer won
    const computerWon = game.checkWin(game.getComputerMark())
    // // if yes, break
    if (computerWon) {
      set({ gameState: SingleGameState.FINISHED })
    }
    // check if draw (board full)
    const isDraw = game.isBoardFull()
    // // if yes, break
    if (isDraw) {
      set({ gameState: SingleGameState.FINISHED })
    }

    // switch to user
    set({ activePlayer: Player.USER })
  },
  //--------------------------------------
  //--------------------------------------
  resetAllStates() {
    set({
      board: getEmptyBoard(),
      mark: 'unknown',
      activePlayer: null,
      gameState: SingleGameState.NONE,
      gameWinner: null,
    })
  },
}))
