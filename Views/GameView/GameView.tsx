import Screen from '@/components/ui/screen-template/Screen'
import { useGlobalStore } from '@/stores/globalStore'
import React from 'react'
import Board from './components/Board/Board'
import GameViewFooter from './components/GameViewFooter'
import GameViewHeader from './components/GameViewHeader/GameViewHeader'
import { GameState } from '@/server/gameTypes'

export default function GameView() {
  const { activePlayer, identity, board, sendMove, gameState } = useGlobalStore()

  return (
    <Screen>
      <Screen.Header>
        <GameViewHeader />
      </Screen.Header>
      <Screen.Body>
        <Board
          isPlaying={gameState === GameState.PLAYING}
          board={board}
          isDisabled={activePlayer?.id !== identity?.id || gameState !== 'playing'}
          onMove={sendMove}
        />
      </Screen.Body>
      <Screen.Footer>
        <GameViewFooter />
      </Screen.Footer>
    </Screen>
  )
}
