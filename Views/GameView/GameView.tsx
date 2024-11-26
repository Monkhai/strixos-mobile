import { ThemedView } from '@/components/ThemedView'
import { useGlobalStore } from '@/stores/globalStore'
import React from 'react'
import { View } from 'react-native'
import Board from './components/Board/Board'
import GameViewFooter from './components/GameViewFooter'
import GameViewHeader from './components/GameViewHeader'

export default function GameView() {
  const { activePlayer, identity, board, sendMove, gameState } = useGlobalStore()

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <GameViewHeader />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Board board={board} isDisabled={activePlayer?.id !== identity?.id || gameState !== 'playing'} onMove={sendMove} />
      </View>
      <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <GameViewFooter />
      </View>
    </ThemedView>
  )
}
