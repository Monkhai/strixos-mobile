import { router, Stack } from 'expo-router'
import React, { ReactNode } from 'react'
import { IconSymbol } from './IconSymbol'
import { IconButton } from './UIButton'
import { Platform, useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useGlobalStore } from '@/stores/globalStore'
import Avatar from './Avatar'

interface Props {
  left?: ReactNode
  hideLeft?: boolean
  right?: ReactNode
  hideRight?: boolean
}
export default function CustomHeader({ left, hideLeft = false, right, hideRight = false }: Props) {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTransparent: true,
        title: '',
        headerRight: () => {
          if (hideRight) return null
          if (right) return right
          return <DefaultRightButton />
        },
        headerLeft: () => {
          if (hideLeft) return null
          if (left) return left
          return <DefaultLeftButton />
        },
      }}
    />
  )
}

function DefaultRightButton() {
  const { preferences } = useGlobalStore()
  return (
    <IconButton
      rotate
      onPress={() => {
        router.replace('/settings')
      }}
      style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
    >
      <Avatar avatar={preferences.preferedAvatar} size={32} />
    </IconButton>
  )
}

function DefaultLeftButton() {
  const theme = useColorScheme()

  return (
    <IconButton onPress={() => router.replace('/')} style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
      <IconSymbol name="chevron.left" size={Platform.select({ ios: 20, android: 32 })} color={Colors[theme ?? 'light'].primary} />
    </IconButton>
  )
}
