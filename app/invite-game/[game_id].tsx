import Loader from '@/components/ui/Loader'
import { WS_URL } from '@/server/constants'
import { ClientMessageType, JoinGameInviteMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { View } from 'react-native'

export default function Page() {
  const { ws, createWSConnection } = useGlobalStore()
  const { game_id } = useLocalSearchParams<{ game_id: string }>()

  function joinGame() {
    if (!ws) {
      createWSConnection()
    }
    if (ws?.getReadyState() !== WebSocket.OPEN) {
      ws?.connect(WS_URL)
    }
    const mg: JoinGameInviteMessage = {
      type: ClientMessageType.JOIN_INVITE_GAME,
      gameID: game_id,
    }
    if (ws) {
      ws.sendMessage(mg)
    }
  }

  useEffect(() => {
    joinGame()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Loader size={200} />
    </View>
  )
}
