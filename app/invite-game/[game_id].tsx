import DangerButton from '@/components/ui/buttons/DangerButton'
import Screen from '@/components/ui/screen-template/Screen'
import SpecialTitle from '@/components/ui/SpecialTitle'
import { WS_URL } from '@/server/constants'
import { ClientMessageType, JoinGameInviteMessage, LeaveGameMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import LoaderBoard from '@/Views/GameView/components/Board/LoaderBoard'
import { StackActions, CommonActions } from '@react-navigation/native'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'

export default function Page() {
  const { ws } = useGlobalStore()
  const { game_id } = useLocalSearchParams<{ game_id: string }>()

  const joinGame = () => {
    if (!ws) {
      return
    }
    if (ws.getReadyState() !== WebSocket.OPEN) {
      ws?.connect(WS_URL)
    }
    const msg: JoinGameInviteMessage = {
      type: ClientMessageType.JOIN_INVITE_GAME,
      gameID: game_id,
    }
    ws.sendMessage(msg)
  }

  const goHome = () => {
    if (ws && ws?.getReadyState() === WebSocket.OPEN) {
      ws.sendMessage(LeaveGameMessage)
    }
    router.dismissTo('/home')
  }

  useEffect(() => {
    const i = setInterval(() => {
      joinGame()
    }, 2000)

    return () => {
      clearInterval(i)
    }
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
