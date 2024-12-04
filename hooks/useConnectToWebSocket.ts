import { WS_URL } from '@/server/constants'
import { useGlobalStore } from '@/stores/globalStore'
import { useEffect } from 'react'

export function useConnectToWebSocket() {
  const { ws, createWSConnection } = useGlobalStore()
  useEffect(() => {
    if (!ws) createWSConnection()
  }, [])
  useEffect(() => {
    if (ws && ws.getReadyState() !== WebSocket['OPEN'] && ws.getReadyState() !== WebSocket['CONNECTING']) {
      console.log('Connecting to WebSocket')
      const err = ws.connect(WS_URL)
      if (err) {
        console.error(err)
      }
    }
  }, [ws])
}
