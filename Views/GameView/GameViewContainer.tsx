import { useGlobalStore } from '@/stores/globalStore'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import LoadingGameView from './components/LoadingGameView/LoadingGameView'
import GameView from './GameView'
import { GameState } from '@/server/gameTypes'
import FakeGameView from './components/FakeGameView'

export default function GameViewContainer() {
  const { ws, gameState } = useGlobalStore()

  // return <FakeGameView />;

  if (gameState === GameState.WAITING) {
    if (!ws) {
      router.replace('/')
      return null
    }
    return <LoadingGameView />
  }
  if (([GameState.FINISHED, GameState.PLAYING, GameState.OPPONENT_DISCONNECTED] as Array<GameState>).includes(gameState)) {
    return <GameView />
  }

  return null
}
