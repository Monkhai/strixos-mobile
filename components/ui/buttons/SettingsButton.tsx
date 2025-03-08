import { useGlobalStore } from '@/stores/globalStore'
import { router } from 'expo-router'
import React from 'react'
import Avatar from '../Avatar'
import IconButton from './IconButton'

export default function SettingsButton() {
  const { preferences } = useGlobalStore()
  return (
    <IconButton rotate onPress={() => router.replace('/settings')}>
      <Avatar avatar={preferences.preferedAvatar} size={32} />
    </IconButton>
  )
}
