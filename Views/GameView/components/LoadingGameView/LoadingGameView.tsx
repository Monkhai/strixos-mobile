import { ThemedView } from '@/components/ThemedView'
import { useGlobalStore } from '@/stores/globalStore'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import LoaderBoard from '../Board/LoaderBoard'
import GameViewFooter from '../GameViewFooter'

export default function LoadingGameView() {
  const { ws } = useGlobalStore()
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoaderBoard />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GameViewFooter />
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({})
