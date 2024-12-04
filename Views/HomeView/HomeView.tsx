import Screen from '@/components/ui/screen-template/Screen'
import React, { useState } from 'react'
import LoaderBoard from '../GameView/components/Board/LoaderBoard'
import HomeViewFooter from './components/HomeViewFooter'
import HomeViewHeader from './components/HomeViewHeader'

export default function HomeView() {
  const [isConnecting, setIsConnecting] = useState(false)

  return (
    <Screen withRouteHeader>
      <Screen.Header>
        <HomeViewHeader />
      </Screen.Header>
      <Screen.Body>
        <LoaderBoard hideCells />
      </Screen.Body>
      <Screen.Footer>
        <HomeViewFooter isConnecting={isConnecting} setIsConnecting={setIsConnecting} />
      </Screen.Footer>
    </Screen>
  )
}
