import { ThemedText } from '@/components/ThemedText'
import { AnimatedPressable } from '@/components/ui/buttons/constants'
import { GeneralButton } from '@/components/ui/UIButton'
import { PrimaryColors } from '@/constants/Colors'
import { SingleGameDifficulty } from '@/lib/singleGame/singleGame'
import { Mark } from '@/server/gameTypes'
import { Player, SingleGameState, useSingleGameStore } from '@/stores/singleGameStore'
import Board from '@/Views/GameView/components/Board/Board'
import OCell from '@/Views/GameView/components/Board/Cell/OCell'
import XCell from '@/Views/GameView/components/Board/Cell/XCell'
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet'
import {
  Blur,
  BlurMask,
  Canvas,
  Circle,
  Group,
  Oval,
  Paint,
  Paragraph,
  Shadow,
  Skia,
  TextAlign,
  TextDecoration,
  TileMode,
} from '@shopify/react-native-skia'
import React, { useEffect, useMemo, useState } from 'react'
import { useColorScheme, View } from 'react-native'
import { useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import DifficultyButton from './components/DifficultyButton'

export default function SingleGameBody() {
  const { board, activePlayer, gameState, playTurn, newGame, game } = useSingleGameStore()
  const [difficulty, setDifficulty] = useState<SingleGameDifficulty>(SingleGameDifficulty.EASY)

  function handleNewGame(mark: Mark) {
    newGame(mark, difficulty)
  }

  if (gameState === SingleGameState.NONE) {
    return (
      <View style={{ gap: 40 }}>
        <View style={{ gap: 20, alignItems: 'center' }}>
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
        <View style={{ gap: 20 }}>
          <ThemedText style={{ textAlign: 'center' }} type="subtitle">
            Choose your difficulty
          </ThemedText>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <DifficultyButton
              difficulty={SingleGameDifficulty.EASY}
              onPress={() => setDifficulty(SingleGameDifficulty.EASY)}
              isSelected={difficulty === SingleGameDifficulty.EASY}
            />
            <DifficultyButton
              difficulty={SingleGameDifficulty.MEDIUM}
              onPress={() => setDifficulty(SingleGameDifficulty.MEDIUM)}
              isSelected={difficulty === SingleGameDifficulty.MEDIUM}
            />
          </View>
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
