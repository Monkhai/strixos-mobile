import UIButton from '@/components/ui/UIButton'
import { WS_URL } from '@/server/constants'
import { RequestGameMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { router } from 'expo-router'
import { Dispatch, SetStateAction } from 'react'
import { Alert, Platform, Text } from 'react-native'

interface Props {
  isConnecting: boolean
  setIsConnecting: Dispatch<SetStateAction<boolean>>
}

export default function HomeViewFooter({ isConnecting, setIsConnecting }: Props) {
  const ws = useGlobalStore(s => s.ws)

  function retryConnection() {
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

  if (ws?.getReadyState() !== WebSocket.OPEN) {
    return (
      <UIButton onPress={retryConnection} isLoading={isConnecting} wide>
        <Text style={{ color: 'white' }}>{isConnecting ? 'connecting' : 'connect'}</Text>
      </UIButton>
    )
  }

  return (
    <UIButton onPress={playGame} wide>
      <Text style={{ color: 'white' }}>Play</Text>
    </UIButton>
  )
}
