import DangerButton from '@/components/ui/buttons/DangerButton'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton'
import { GameState } from '@/server/gameTypes'
import { SingleGameState, useSingleGameStore } from '@/stores/singleGameStore'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function SingleGameViewFooter() {
  const { gameState, resetAllStates } = useSingleGameStore()

  switch (gameState) {
    case SingleGameState.FINISHED: {
      return <GameFinsihedFooter />
    }

    case SingleGameState.PLAYING: {
      return (
        <View>
          <DangerButton
            onPress={() => {
              resetAllStates()
              router.dismissTo('/home')
            }}
            label="Leave"
          />
        </View>
      )
    }

    case SingleGameState.NONE: {
      return (
        <View>
          <DangerButton
            onPress={() => {
              resetAllStates()
              router.dismissTo('/home')
            }}
            label="Leave"
          />
        </View>
      )
    }
  }
}

function GameFinsihedFooter() {
  const { newGame } = useSingleGameStore()

  function handlePlayAgain() {
    newGame('x')
  }

  function handleBackHome() {
    router.replace('/home')
  }

  return (
    <View style={styles[GameState.FINISHED]}>
      <PrimaryButton onPress={handlePlayAgain} wide label="One more" />
      <SecondaryButton onPress={handleBackHome} wide label="Back home" />
    </View>
  )
}

const styles = StyleSheet.create({
  [GameState.FINISHED]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  [GameState.OPPONENT_DISCONNECTED]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
})
