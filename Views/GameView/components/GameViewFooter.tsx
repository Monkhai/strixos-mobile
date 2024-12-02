import DangerButton from '@/components/ui/buttons/DangerButton'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton'
import { TextButton } from '@/components/ui/UIButton'
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
      return (
        <View style={styles[GameState.FINISHED]}>
          <TextButton
            onPress={() => {
              ws?.sendMessage({ type: ClientMessageType.GAME_REQUEST })
            }}
            wide
            type="primary"
            label="One more"
          />
          <TextButton
            onPress={() => {
              router.replace('/')
            }}
            wide
            type="secondary"
            label="Back home"
          />
        </View>
      )
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
              router.replace('/')
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

const styles = StyleSheet.create({
  [GameState.FINISHED]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    width: '50%',
  },
  [GameState.OPPONENT_DISCONNECTED]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    width: '50%',
  },
})
