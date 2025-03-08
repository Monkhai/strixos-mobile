import PrimaryButton from '@/components/ui/buttons/PrimaryButton'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton'
import { WS_URL } from '@/server/constants'
import { ClientMessageType, CreateGameInviteMessage, RequestGameMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { router } from 'expo-router'
import { Dispatch, SetStateAction } from 'react'
import { Alert, Platform, View } from 'react-native'

interface Props {
  isConnecting: boolean
  setIsConnecting: Dispatch<SetStateAction<boolean>>
}

export default function HomeViewFooter({ isConnecting, setIsConnecting }: Props) {
  const { ws, connectionState, createWSConnection } = useGlobalStore()

  function retryConnection() {
    setIsConnecting(true)

    // If there's no WebSocket handler, create one
    if (!ws) {
      createWSConnection(0)
      // Set a timeout to check if connection succeeded
      setTimeout(() => {
        const connectionState = useGlobalStore.getState().connectionState
        if (connectionState !== WebSocket.OPEN) {
          setIsConnecting(false)
          showConnectionError()
        } else {
          setIsConnecting(false)
        }
      }, 10000) // 10 seconds timeout
      return
    }

    // If there is a handler but it's not connected, try to connect
    if (ws.getReadyState() !== WebSocket.OPEN) {
      const err = ws.connect(WS_URL)
      if (err) {
        return
      }

      // Set a reasonable timeout for connection
      const connectionTimeout = 15000 // 15 seconds

      // Clear any existing intervals/timeouts
      let connectionCheckInterval: NodeJS.Timeout | null = null
      let connectionTimeoutId: NodeJS.Timeout | null = null

      // Check connection state periodically
      connectionCheckInterval = setInterval(() => {
        if (ws.getReadyState() === WebSocket.OPEN) {
          setIsConnecting(false)
          if (connectionCheckInterval) clearInterval(connectionCheckInterval)
          if (connectionTimeoutId) clearTimeout(connectionTimeoutId)
        }
      }, 1000)

      // Set timeout for giving up
      connectionTimeoutId = setTimeout(() => {
        if (connectionCheckInterval) clearInterval(connectionCheckInterval)
        setIsConnecting(false)
        showConnectionError()
      }, connectionTimeout)
    } else {
      // Already connected
      setIsConnecting(false)
    }
  }

  // Helper function to show connection error alert
  const showConnectionError = () => {
    Alert.alert(
      'Connection Failed',
      'Could not connect to the server. Please check your internet connection and try again.',
      Platform.select({
        android: [{ isPreferred: true, text: 'RETRY', onPress: retryConnection }, { text: 'OK' }],
        ios: [{ text: 'OK' }, { isPreferred: true, text: 'Retry', onPress: retryConnection }],
      })
    )
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

  if (connectionState !== WebSocket.OPEN) {
    return (
      <View style={{ width: '50%', gap: 20 }}>
        <SecondaryButton onPress={() => router.replace('/single-game')} label="Play alone" />
        <PrimaryButton onPress={retryConnection} isLoading={isConnecting} wide label={isConnecting ? 'Connecting' : 'Connect'} />
      </View>
    )
  }

  return (
    <View style={{ width: '50%', gap: 20 }}>
      <PrimaryButton onPress={playGame} label="Play online" />
      <SecondaryButton onPress={createInviteGame} label="Play with a friend" />
      <SecondaryButton onPress={() => router.replace('/single-game')} label="Play alone" />
    </View>
  )
}
