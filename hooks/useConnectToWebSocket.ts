import { WS_URL } from '@/server/constants'
import { useGlobalStore } from '@/stores/globalStore'
import { useEffect, useRef } from 'react'

/**
 * Hook to establish and maintain WebSocket connection.
 * This hook will automatically initiate a connection when the app loads.
 */
export function useConnectToWebSocket() {
  const { ws, createWSConnection, connectionState, reconnectionAttempts } = useGlobalStore()
  const isInitialSetupDone = useRef(false)
  const MAX_RECONNECTION_ATTEMPTS = 3

  // Initial connection effect - runs once when the app loads
  useEffect(() => {
    // Only run initial setup once
    if (isInitialSetupDone.current) return

    isInitialSetupDone.current = true

    // If we don't have a WebSocket handler yet, create one
    if (!ws) {
      createWSConnection(0)
    } else if (connectionState !== 1 && connectionState !== 0) {
      // Not OPEN or CONNECTING
      // We have a handler but it's not connected or connecting
      ws.connect(WS_URL)
    }
  }, [ws, connectionState, createWSConnection])

  // This effect handles reconnection if connection state changes to CLOSED
  useEffect(() => {
    // Skip initial render
    if (!isInitialSetupDone.current) return

    // Only attempt reconnect if we have a WS handler, it's closed, and we haven't exceeded max attempts
    if (ws && connectionState === 3 && reconnectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
      // Add exponential backoff for reconnection
      const delay = 1000 * Math.pow(2, reconnectionAttempts)
      const reconnectTimer = setTimeout(() => {
        ws.connect(WS_URL)
      }, delay)

      return () => clearTimeout(reconnectTimer)
    }
  }, [connectionState, ws, reconnectionAttempts])
}
