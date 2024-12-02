import GameLogo from '@/components/ui/GameLogo'
import GameTitle from '@/components/ui/GameTitle'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function HomeViewBody() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <GameTitle />
        <GameLogo />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    overflow: 'visible',
  },
})
