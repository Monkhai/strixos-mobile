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

    case GameState.PLAYING: {
      return (
        <View>
          <TextButton
            onPress={() => {
              ws?.sendMessage({ type: ClientMessageType.LEAVE_GAME })
            }}
            label="Leave"
            type="danger"
          />
        </View>
      )
    }

    case GameState.WAITING: {
      return (
        <View>
          <TextButton
            onPress={() => {
              ws?.sendMessage({ type: ClientMessageType.LEAVE_QUEUE })
            }}
            label="Exit Queue"
            type="danger"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    width: '50%',
  },
})
