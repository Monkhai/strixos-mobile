import { Stack } from 'expo-router'
import React from 'react'
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
