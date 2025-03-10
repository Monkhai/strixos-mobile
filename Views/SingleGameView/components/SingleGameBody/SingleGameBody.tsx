import { View, Text } from 'react-native'
import React from 'react'
import { Player, SingleGameState, useSingleGameStore } from '@/stores/singleGameStore'
import { GeneralButton } from '@/components/ui/UIButton'
import XCell from '@/Views/GameView/components/Board/Cell/XCell'
import OCell from '@/Views/GameView/components/Board/Cell/OCell'
import Board from '@/Views/GameView/components/Board/Board'
import { ThemedText } from '@/components/ThemedText'
import { Mark } from '@/server/gameTypes'

export default function SingleGameBody() {
  const { board, activePlayer, gameState, playTurn, newGame, game } = useSingleGameStore()

  function handleNewGame(mark: Mark) {
    newGame(mark)
  }

  if (gameState === SingleGameState.NONE) {
    return (
      <View style={{ gap: 20 }}>
        <ThemedText style={{ textAlign: 'center' }} type="subtitle">
          Choose your mark
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <GeneralButton onPress={() => handleNewGame('x')}>
            <XCell isPlaying={false} dying={false} containerSize={50} />
          </GeneralButton>
          <GeneralButton onPress={() => handleNewGame('o')}>
            <OCell isPlaying={false} dying={false} containerSize={50} />
          </GeneralButton>
        </View>
      </View>
    )
  }

  return (
    <Board
      board={board}
      isDisabled={!game || gameState !== SingleGameState.PLAYING || activePlayer !== Player.USER}
      onMove={playTurn}
      isPlaying={gameState === SingleGameState.PLAYING}
    />
  )
}
