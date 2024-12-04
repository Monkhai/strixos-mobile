import DangerButton from '@/components/ui/buttons/DangerButton'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton'
import { GameState } from '@/server/gameTypes'
import { ClientMessageType } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function GameViewFooter() {
  const { ws, gameState } = useGlobalStore()

  switch (gameState) {
    case GameState.FINISHED: {
      return <GameFinsihedFooter />
    }
    case GameState.OPPONENT_DISCONNECTED: {
      return (
        <View style={styles[GameState.OPPONENT_DISCONNECTED]}>
          <PrimaryButton
            onPress={() => {
              ws?.sendMessage({ type: ClientMessageType.GAME_REQUEST })
            }}
            wide
            label="One more"
          />
          <SecondaryButton
            onPress={() => {
              router.dismissTo('/home')
            }}
            wide
            label="Back home"
          />
        </View>
      )
    }

    case GameState.PLAYING: {
      return (
        <View>
          <DangerButton
            onPress={() => {
              ws?.sendMessage({ type: ClientMessageType.LEAVE_GAME })
            }}
            label="Leave"
          />
        </View>
      )
    }

    case GameState.WAITING: {
      return (
        <View>
          <DangerButton
            onPress={() => {
              ws?.sendMessage({ type: ClientMessageType.LEAVE_QUEUE })
            }}
            label="Exit Queue"
          />
        </View>
      )
    }
  }

  return null
}

function GameFinsihedFooter() {
  const { ws, isInviteGame, newGameID } = useGlobalStore()

  function handlePlayAgain() {
    if (isInviteGame && newGameID) {
      router.replace(`/invite-game/${newGameID}`)
      return
    }
    ws?.sendMessage({ type: ClientMessageType.GAME_REQUEST })
  }

  function handleBackHome() {
    if (isInviteGame) {
      router.dismissTo('/home')
      return
    }
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
