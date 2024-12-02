import { TextButton } from '@/components/ui/UIButton'
import { ClientMessageType, LeaveInviteGameMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { router } from 'expo-router'
import React from 'react'
import { Share, View } from 'react-native'

export default function lobby() {
  const { gameID, ws } = useGlobalStore()
  const baseUrl = 'strixos://invite-game/'

  if (!gameID) {
    router.replace('/home')
    return null
  }

  async function share() {
    Share.share({
      title: 'Join my game',
      message: baseUrl + gameID,
      url: baseUrl + gameID,
    })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextButton label="Share" onPress={share} />
      <TextButton
        label="Leave"
        onPress={() => {
          if (ws) {
            const msg: LeaveInviteGameMessage = {
              type: ClientMessageType.LEAVE_INVITE_GAME,
              gameID,
            }
            ws?.sendMessage(msg)
          }
          router.replace('/home')
        }}
      />
    </View>
  )
}
