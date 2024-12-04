import Screen from '@/components/ui/screen-template/Screen'
import { WS_URL } from '@/server/constants'
import { useGlobalStore } from '@/stores/globalStore'
import React, { useEffect, useState } from 'react'
import LoaderBoard from '../GameView/components/Board/LoaderBoard'
import HomeViewFooter from './components/HomeViewFooter'
import HomeViewHeader from './components/HomeViewHeader'

export default function HomeView() {
  const { ws, createWSConnection } = useGlobalStore()
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (!ws) createWSConnection()
  }, [])

  useEffect(() => {
    if (ws && ws.getReadyState() !== WebSocket['OPEN'] && ws.getReadyState() !== WebSocket['CONNECTING']) {
      const err = ws.connect(WS_URL)
      if (err) {
        console.error(err)
      }
    }
  }, [ws])

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
