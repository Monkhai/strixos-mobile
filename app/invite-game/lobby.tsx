import CustomHeader from '@/components/ui/CustomHeader'
import LobbyView from '@/Views/InviteGameView/LobbyView'
import React from 'react'

export default function lobby() {
  return (
    <>
      <CustomHeader hideRight hideLeft specialTitle title="Play with a friend" />
      <LobbyView />
    </>
  )
}
