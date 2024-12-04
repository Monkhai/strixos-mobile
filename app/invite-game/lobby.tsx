import CustomHeader from '@/components/ui/CustomHeader'
import GameTitle from '@/components/ui/GameTitle'
import Screen from '@/components/ui/screen-template/Screen'
import { TextButton } from '@/components/ui/UIButton'
import { ClientMessageType, LeaveInviteGameMessage } from '@/server/messageTypes'
import { useGlobalStore } from '@/stores/globalStore'
import LobbyView from '@/Views/InviteGameView/LobbyView'
import { router } from 'expo-router'
import React from 'react'
import { Share, View } from 'react-native'

export default function lobby() {
  return (
    <>
      <CustomHeader hideRight specialTitle title="Play with a friend" />
      <LobbyView />
    </>
  )
}
