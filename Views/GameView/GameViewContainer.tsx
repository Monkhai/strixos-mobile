import { GameState } from '@/server/gameTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { router } from 'expo-router'
import React from 'react'
import LoadingGameView from './components/LoadingGameView/LoadingGameView'
import GameView from './GameView'

export default function GameViewContainer() {
  const { ws, gameState } = useGlobalStore()

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
