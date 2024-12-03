import { ThemedView } from '@/components/ThemedView'
import { ClientMessageType, JoinGameInviteMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { useHeaderHeight } from '@react-navigation/elements'
import React, { useEffect, useState } from 'react'
import { Button, Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import HomeViewFooter from './components/HomeViewFooter'
import { WS_URL } from '@/server/constants'
import HomeViewBody from './components/HomeViewBody'
import Screen from '@/components/ui/screen-template/Screen'
import LoadingMarks from '@/components/ui/LoadingMarks'
import LoaderBoard from '../GameView/components/Board/LoaderBoard'

export default function HomeView() {
  const { ws, createWSConnection } = useGlobalStore()
  const insets = useSafeAreaInsets()
  const [isConnecting, setIsConnecting] = useState(false)
  const headerHeight = useHeaderHeight()

  useEffect(() => {
    if (!ws) createWSConnection()
  }, [])

  useEffect(() => {
    if (ws && ws.getReadyState() !== WebSocket['OPEN'] && ws.getReadyState() !== WebSocket['CONNECTING']) {
      const err = ws.connect(WS_URL)
      if (err) {
        console.error(err)
      }
    }
  }, [ws])

  return (
    <Screen withRouteHeader>
      <Screen.Header>
        <HomeViewBody />
      </Screen.Header>
      <Screen.Body>
        {/*  */}
        {/* FIND SOMETHING TO PUT HERE */}
        {/*  */}
      </Screen.Body>
      <Screen.Footer>
        <HomeViewFooter isConnecting={isConnecting} setIsConnecting={setIsConnecting} />
      </Screen.Footer>
    </Screen>
  )
}
