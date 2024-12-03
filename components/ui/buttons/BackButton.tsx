import { router } from 'expo-router'
import React from 'react'
import BackIcon from '../icons/BackIcon'
import IconButton from './IconButton'

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
