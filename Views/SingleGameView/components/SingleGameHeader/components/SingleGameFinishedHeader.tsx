import { View, Text } from 'react-native'
import React from 'react'
import { useGlobalStore } from '@/stores/globalStore'
import Avatar from '@/components/ui/Avatar'
import { ThemedText } from '@/components/ThemedText'
import { Player, useSingleGameStore } from '@/stores/singleGameStore'
import avatarsMap from '@/assets/characters/avatarsMap'

export default function SingleGameFinishedHeader() {
  const { gameWinner, identity } = useSingleGameStore()
  const map: Record<Player | 'null', { name: string; avatar: keyof typeof avatarsMap }> = {
    [Player.USER]: { name: 'You', avatar: identity?.avatar ?? 'unknown' },
    [Player.COMPUTER]: { name: 'Computer', avatar: 'default' },
    null: { name: 'Unknown', avatar: 'unknown' },
  }
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Avatar size={50} avatar={map[gameWinner ?? 'null']?.avatar ?? 'unknown'} />
        <ThemedText type="title" style={{ paddingTop: 8 }}>
          {map[gameWinner ?? 'null']?.name} Won
        </ThemedText>
      </View>
    </View>
  )
}
