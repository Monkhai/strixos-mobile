import { Stack } from 'expo-router'
import React from 'react'
import BackButton from './buttons/BackButton'
import SettingsButton from './buttons/SettingsButton'
import { Platform, Text, View } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedText } from '../ThemedText'
import SpecialTitle from './SpecialTitle'

interface Props {
  hideLeft?: boolean
  hideRight?: boolean
  title?: string
  specialTitle?: React.ReactNode
}
export default function CustomHeader({ hideLeft = false, hideRight = false, title = '', specialTitle = false }: Props) {
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
                  paddingTop: specialTitle ? 12 : 8,
                }}
              >
                {specialTitle ? <SpecialTitle title={props.children} /> : <ThemedText type="title">{props.children}</ThemedText>}
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
