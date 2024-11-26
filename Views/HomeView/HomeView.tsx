import { ThemedView } from '@/components/ThemedView'
import { WS_URL } from '@/server/constants'
import { useGlobalStore } from '@/stores/globalStore'
import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import HomeViewFooter from './components/HomeViewFooter'
import HomeViewBody from './components/HomeViewBody'
import { useHeaderHeight } from '@react-navigation/elements'

export default function HomeView() {
  const { ws, createWSConnection, preferences } = useGlobalStore()
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
      {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <View style={{ marginBottom: 6 }}>
          <Avatar size={40} avatar={preferences.preferedAvatar} />
        </View>
        <ThemedText type="title">{preferences.displayName}</ThemedText>
      </View>
      <ThemedText type="subtitle">TicTacToe Plus</ThemedText> */}
      <View style={{ flex: 2, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
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
