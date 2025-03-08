import Screen from '@/components/ui/screen-template/Screen'
import { Player, SingleGameState, useSingleGameStore } from '@/stores/singleGameStore'
import React, { useEffect } from 'react'
import Board from '../GameView/components/Board/Board'
import GameViewHeader from '../GameView/components/GameViewHeader/GameViewHeader'
export default function SingleGameView() {
  const { board, activePlayer, identity, gameState, playTurn, newGame, game } = useSingleGameStore()

  useEffect(() => {
    if (!game) {
      newGame('x')
    }
  }, [game])

  console.log(activePlayer)

  return (
    <Screen>
      <Screen.Header>
        <GameViewHeader />
      </Screen.Header>
      <Screen.Body>
        <Board
          board={board}
          isDisabled={!game || gameState !== SingleGameState.PLAYING || activePlayer !== Player.USER}
          onMove={playTurn}
          isPlaying={gameState === SingleGameState.PLAYING}
        />
      </Screen.Body>
      <Screen.Footer></Screen.Footer>
    </Screen>
  )
}
