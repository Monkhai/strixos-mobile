import DangerButton from '@/components/ui/buttons/DangerButton'
import Loader from '@/components/ui/Loader'
import Screen from '@/components/ui/screen-template/Screen'
import SpecialTitle from '@/components/ui/SpecialTitle'
import { PrimaryColors } from '@/constants/Colors'
import { WS_URL } from '@/server/constants'
import { ClientMessageType, JoinGameInviteMessage, LeaveGameMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import LoaderBoard from '@/Views/GameView/components/Board/LoaderBoard'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { useColorScheme, View } from 'react-native'

export default function Page() {
  const { ws, createWSConnection } = useGlobalStore()
  const { game_id } = useLocalSearchParams<{ game_id: string }>()
  const theme = useColorScheme() ?? 'light'

  function joinGame() {
    if (!ws) {
      createWSConnection()
    }
    if (ws?.getReadyState() !== WebSocket.OPEN) {
      ws?.connect(WS_URL)
    }
    const msg: JoinGameInviteMessage = {
      type: ClientMessageType.JOIN_INVITE_GAME,
      gameID: game_id,
    }
    if (ws) {
      ws.sendMessage(msg)
    }
  }

  function goHome() {
    if (ws && ws?.getReadyState() === WebSocket.OPEN) {
      ws.sendMessage(LeaveGameMessage)
      router.replace('/home')
    }
  }

  useEffect(() => {
    joinGame()
  }, [])

  return (
    <Screen>
      <Screen.Header>
        <SpecialTitle title="Loading your game" />
      </Screen.Header>
      <Screen.Body>
        <LoaderBoard />
      </Screen.Body>
      <Screen.Footer>
        <DangerButton label="Cancel" onPress={goHome} />
      </Screen.Footer>
    </Screen>
  )
}
