import GameTitle from '@/components/ui/GameTitle'
import Screen from '@/components/ui/screen-template/Screen'
import React from 'react'
import LoaderBoard from '../Board/LoaderBoard'
import GameViewFooter from '../GameViewFooter'
import { View } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import LoadingMarks from '@/components/ui/LoadingMarks'

export default function LoadingGameView() {
  return (
    <Screen>
      <Screen.Header>
        <GameTitle />
      </Screen.Header>
      <Screen.Body>
        <View style={{ alignItems: 'center', gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
            <ThemedText type="subtitle">Looking for an opponent</ThemedText>
            <LoadingMarks />
          </View>
          <LoaderBoard />
        </View>
      </Screen.Body>
      <Screen.Footer>
        <GameViewFooter />
      </Screen.Footer>
    </Screen>
  )
}
