import { ThemedText } from '@/components/ThemedText'
import DangerButton from '@/components/ui/buttons/DangerButton'
import IconButton from '@/components/ui/buttons/IconButton'
import ShareIcon from '@/components/ui/icons/ShareIcon'
import Screen from '@/components/ui/screen-template/Screen'
import { ClientMessageType, LeaveInviteGameMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { router } from 'expo-router'
import React from 'react'
import { Share } from 'react-native'

export default function LobbyView() {
  const { gameID, ws } = useGlobalStore()
  // const baseUrl = 'strixos://invite-game/'
  const baseUrl = 'https://play.strixos.app/invite-game/'

  if (!gameID) {
    router.replace('/home')
    return null
  }

  async function shareGame() {
    Share.share({
      title: 'Join my game',
      url: baseUrl + gameID,
      message: 'Join my game: ' + baseUrl + gameID,
    })
  }

  const leaveInviteGame = () => {
    if (ws) {
      const msg: LeaveInviteGameMessage = {
        type: ClientMessageType.LEAVE_INVITE_GAME,
        gameID,
      }
      ws?.sendMessage(msg)
    }
    router.replace('/home')
  }

  return (
    <Screen withRouteHeader>
      <Screen.Header />
      <Screen.Body>
        <IconButton onPress={shareGame}>
          <ShareIcon />
        </IconButton>
        <ThemedText type="subtitle">Share game link</ThemedText>
      </Screen.Body>
      <Screen.Footer>
        <DangerButton label="Cancel" onPress={leaveInviteGame} />
      </Screen.Footer>
    </Screen>
  )
}
