import { View, Text, PressableProps } from 'react-native'
import React from 'react'
import IconButton from './IconButton'
import BackIcon from '../icons/BackIcon'
import { router } from 'expo-router'

export default function BackButton() {
  return (
    <IconButton
      onPress={() => {
        router.replace('/home')
      }}
    >
      {(h, w) => <BackIcon h={h} w={w} />}
    </IconButton>
  )
}
