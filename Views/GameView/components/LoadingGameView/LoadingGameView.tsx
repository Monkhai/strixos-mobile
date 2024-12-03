import GameTitle from '@/components/ui/GameTitle'
import Screen from '@/components/ui/screen-template/Screen'
import React from 'react'
import LoaderBoard from '../Board/LoaderBoard'
import GameViewFooter from '../GameViewFooter'

export default function LoadingGameView() {
  return (
    <Screen>
      <Screen.Header>
        <GameTitle />
      </Screen.Header>
      <Screen.Body>
        <LoaderBoard />
      </Screen.Body>
      <Screen.Footer>
        <GameViewFooter />
      </Screen.Footer>
    </Screen>
  )
}
