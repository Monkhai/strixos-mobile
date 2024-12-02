import { router, Stack } from 'expo-router'
import React, { ReactNode } from 'react'
import { IconSymbol } from './IconSymbol'
import { IconButton } from './UIButton'
import { Platform, useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useGlobalStore } from '@/stores/globalStore'
import Avatar from './Avatar'
import BackButton from './buttons/BackButton'
import SettingsButton from './buttons/SettingsButton'

interface Props {
  hideLeft?: boolean
  hideRight?: boolean
}
export default function CustomHeader({ hideLeft = false, hideRight = false }: Props) {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTransparent: true,
        title: '',
        headerRight: () => {
          if (hideRight) return null
          return <DefaultRightButton />
        },
        headerLeft: () => {
          if (hideLeft) return null
          return <DefaultLeftButton />
        },
      }}
    />
  )
}

function DefaultRightButton() {
  return <SettingsButton />
}

function DefaultLeftButton() {
  return <BackButton />
}
