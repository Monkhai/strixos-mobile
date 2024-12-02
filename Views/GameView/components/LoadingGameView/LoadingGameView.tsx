import { ThemedView } from '@/components/ThemedView'
import GameTitle from '@/components/ui/GameTitle'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LoaderBoard from '../Board/LoaderBoard'
import GameViewFooter from '../GameViewFooter'

export default function LoadingGameView() {
  const { top, bottom } = useSafeAreaInsets()
  return (
    <ThemedView style={{ paddingTop: top, paddingBottom: bottom, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GameTitle />
      </View>
      <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 }}>
        <LoaderBoard />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GameViewFooter />
      </View>
    </ThemedView>
  )
}
