import { View, Text } from 'react-native'
import React from 'react'
import { useGlobalStore } from '@/stores/globalStore'
import Avatar from '@/components/ui/Avatar'
import { ThemedText } from '@/components/ThemedText'

export default function FinishedHeader() {
  const { gameWinner, identity, opponentIdentity } = useGlobalStore()
  const map = {
    [identity?.id ?? 0]: { name: 'You', avatar: identity?.avatar },
    [opponentIdentity?.id ?? 1]: { name: opponentIdentity?.displayName, avatar: opponentIdentity?.avatar },
  }
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Avatar size={50} avatar={map[gameWinner?.id ?? 0]?.avatar ?? 'unknown'} />
        <ThemedText type="title" style={{ paddingTop: 8 }}>
          {map[gameWinner?.id ?? 0]?.name} Won
        </ThemedText>
      </View>
    </View>
  )
}
