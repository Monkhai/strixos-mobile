import { View, Text } from 'react-native'
import React from 'react'
import IconButton from './IconButton'
import Avatar from '../Avatar'
import { useGlobalStore } from '@/stores/globalStore'
import { router } from 'expo-router'

export default function SettingsButton() {
  const { preferences } = useGlobalStore()
  return (
    <IconButton rotate onPress={() => router.replace('/settings')}>
      <Avatar avatar={preferences.preferedAvatar} size={32} />
    </IconButton>
  )
}
