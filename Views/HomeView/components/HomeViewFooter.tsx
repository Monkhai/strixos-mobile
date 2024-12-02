import IconButton from '@/components/ui/buttons/IconButton'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton'
import BackIcon from '@/components/ui/icons/BackIcon'
import UIButton from '@/components/ui/UIButton'
import { WS_URL } from '@/server/constants'
import { ClientMessageType, CreateGameInviteMessage, RequestGameMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Alert, Platform, Text, View } from 'react-native'

interface Props {
  isConnecting: boolean
  setIsConnecting: Dispatch<SetStateAction<boolean>>
}

export default function HomeViewFooter({ isConnecting, setIsConnecting }: Props) {
  const ws = useGlobalStore(s => s.ws)
  const createWSConnection = useGlobalStore(s => s.createWSConnection)

  // useEffect(() => {
  //   if (!ws) createWSConnection()
  // }, [])

  function retryConnection() {
    if (!ws) {
      createWSConnection()
      return
    }
    setIsConnecting(true)
    if (ws) {
      ws.connect(WS_URL)
    }
    const second = 1000
    const minute = second * 60

    let i: NodeJS.Timeout
    let t: NodeJS.Timeout

    i = setInterval(() => {
      if (ws && ws.getReadyState() !== WebSocket.OPEN) {
        ws.connect(WS_URL)
      } else {
        clearInterval(i)
        clearTimeout(t)
        setIsConnecting(false)
      }
    }, 5 * second)

    t = setTimeout(() => {
      setIsConnecting(false)
      clearInterval(i)
      Alert.alert(
        'Something went wrong',
        'Could not connect',
        Platform.select({
          android: [{ isPreferred: true, text: 'RETRY', onPress: retryConnection }, { text: 'OK' }],
          ios: [{ text: 'OK' }, { isPreferred: true, text: 'Retry', onPress: retryConnection }],
        })
      )
    }, minute)
  }

  function playGame() {
    if (ws) {
      ws.sendMessage(RequestGameMessage)
      router.replace('/game')
    }
  }

  function createInviteGame() {
    const mg: CreateGameInviteMessage = {
      type: ClientMessageType.CREATE_INVITE_GAME,
    }
    if (ws) {
      ws.sendMessage(mg)
    }
  }

  if (ws?.getReadyState() !== WebSocket.OPEN) {
    return <PrimaryButton onPress={retryConnection} isLoading={isConnecting} wide label={isConnecting ? 'Connecting' : 'Connect'} />
  }

  return (
    <View style={{ width: '50%', gap: 20 }}>
      <PrimaryButton onPress={playGame} label="Play online" />
      <SecondaryButton onPress={createInviteGame} label="Play with a friend" />
    </View>
  )
}
