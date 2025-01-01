import { ThemedText } from '@/components/ThemedText'
import DangerButton from '@/components/ui/buttons/DangerButton'
import IconButton from '@/components/ui/buttons/IconButton'
import ShareIcon from '@/components/ui/icons/ShareIcon'
import Loader from '@/components/ui/Loader'
import Screen from '@/components/ui/screen-template/Screen'
import { Colors } from '@/constants/Colors'
import { ClientMessageType, LeaveInviteGameMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { isShader } from '@shopify/react-native-skia'
import { router } from 'expo-router'
import React from 'react'
import { Share, useColorScheme, View } from 'react-native'

export default function LobbyView() {
  const { gameID, ws } = useGlobalStore()
  const theme = useColorScheme() ?? 'light'
  const [hasShared, setHasShared] = React.useState(false)
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
    }).then(() => {
      setHasShared(true)
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
        {hasShared ? (
          <View style={{ justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <Loader color={Colors[theme].primary} />
            <ThemedText type="subtitle">Waiting for your friend to join...</ThemedText>
          </View>
        ) : (
          <>
            <IconButton onPress={shareGame}>
              <ShareIcon />
            </IconButton>
            <ThemedText type="subtitle">Share game link</ThemedText>
          </>
        )}
      </Screen.Body>
      <Screen.Footer>
        <DangerButton label="Cancel" onPress={leaveInviteGame} />
      </Screen.Footer>
    </Screen>
  )
}
