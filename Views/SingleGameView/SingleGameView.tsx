import Screen from '@/components/ui/screen-template/Screen'
import { Player, SingleGameState, useSingleGameStore } from '@/stores/singleGameStore'
import React, { useEffect } from 'react'
import Board from '../GameView/components/Board/Board'
import GameViewHeader from '../GameView/components/GameViewHeader/GameViewHeader'
import SingleGameViewHeader from './components/SingleGameHeader/SingleGameHeader'
import SingleGameViewFooter from './components/SingleGameFooter/SingleGameFooter'
import SingleGameBody from './components/SingleGameBody/SingleGameBody'

export default function SingleGameView() {
  return (
    <Screen>
      <Screen.Header>
        <SingleGameViewHeader />
      </Screen.Header>
      <Screen.Body>
        <SingleGameBody />
      </Screen.Body>
      <Screen.Footer>
        <SingleGameViewFooter />
      </Screen.Footer>
    </Screen>
  )
}
