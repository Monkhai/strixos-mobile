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
    <ThemedView style={{ flex: 1, paddingTop: insets.top + headerHeight, justifyContent: 'flex-start', alignItems: 'center' }}>
      <View style={{ flex: 3, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <HomeViewBody />
      </View>
      <View style={[styles.footer, { paddingBottom: Platform.select({ android: insets.bottom + 32, ios: insets.bottom }) }]}>
        <HomeViewFooter isConnecting={isConnecting} setIsConnecting={setIsConnecting} />
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
