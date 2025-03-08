import Screen from '@/components/ui/screen-template/Screen'
import { Player, SingleGameState, useSingleGameStore } from '@/stores/singleGameStore'
import React, { useEffect } from 'react'
import Board from '../GameView/components/Board/Board'
import GameViewHeader from '../GameView/components/GameViewHeader/GameViewHeader'
import SingleGameViewHeader from './components/SingleGameHeader/SingleGameHeader'
import SingleGameViewFooter from './components/SingleGameFooter/SingleGameFooter'

export default function SingleGameView() {
  const { board, activePlayer, gameState, playTurn, newGame, game } = useSingleGameStore()

  return (
    <Screen>
      <Screen.Header>
        <SingleGameViewHeader />
      </Screen.Header>
      <Screen.Body>
        <Board
          board={board}
          isDisabled={!game || gameState !== SingleGameState.PLAYING || activePlayer !== Player.USER}
          onMove={playTurn}
          isPlaying={gameState === SingleGameState.PLAYING}
        />
      </Screen.Body>
      <Screen.Footer>
        <SingleGameViewFooter />
      </Screen.Footer>
    </Screen>
  )
}
