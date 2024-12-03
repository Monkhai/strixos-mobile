import { Stack } from 'expo-router'
import React from 'react'
import BackButton from './buttons/BackButton'
import SettingsButton from './buttons/SettingsButton'
import { Platform, Text, View } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedText } from '../ThemedText'

interface Props {
  hideLeft?: boolean
  hideRight?: boolean
  title?: string
}
export default function CustomHeader({ hideLeft = false, hideRight = false, title = '' }: Props) {
  const headerHeight = useHeaderHeight()
  const insets = useSafeAreaInsets()
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTransparent: true,
        title,
        headerTitle: Platform.select({
          ios: props => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: headerHeight - insets.top,
                  paddingTop: 8,
                }}
              >
                <ThemedText type="title">{props.children}</ThemedText>
              </View>
            )
          },
          default: undefined,
        }),
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
