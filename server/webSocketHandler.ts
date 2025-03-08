import { getIdentity } from '@/storage/secureStorage'
import { ClientMessage, ClientMessageType, UpdateIdentityMessage } from './messageTypes'

export class WebSocketHandler {
  private onOpen: () => void
  private onClose: () => void
  private onMessage: (event: MessageEvent) => void
  private onError: (event: Event) => void
  private ws: WebSocket | null = null
  private reconnectTimeout: NodeJS.Timeout | null = null
  private isReconnecting: boolean = false
  private isClosingDueToError: boolean = false

  constructor({
    onOpen,
    onClose,
    onMessage,
    onError,
  }: {
    onOpen: () => void
    onClose: () => void
    onMessage: (event: MessageEvent<string>) => void
    onError: (event: Event) => void
  }) {
    this.onOpen = onOpen
    this.onClose = onClose
    this.onMessage = onMessage
    this.onError = onError
  }

  public connect(path: string): Error | null {
    // Clear any pending reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    // If already connecting or connected, don't try again
    if (this.ws) {
      if (this.ws.readyState === WebSocket.CONNECTING) {
        return new Error('WebSocket is already connecting')
      }

      if (this.ws.readyState === WebSocket.OPEN) {
        return new Error('WebSocket is already connected')
      }

      // If closing or closed, close it properly first
      this.closeConnection() // This will properly clean up the existing socket
    }

    // Create a new WebSocket connection
    try {
      this.ws = new WebSocket(path)

      // Use wrapper functions to avoid potential memory leaks from direct references
      this.ws.onopen = event => {
        this.isReconnecting = false
        this.onOpen()
      }

      // Handle both normal closures and error-related closures
      this.ws.onclose = event => {
        // If we already handled an error for this connection, don't trigger onClose again
        if (this.isClosingDueToError) {
          this.isClosingDueToError = false
          return
        }

        this.onClose()
      }

      this.ws.onmessage = event => {
        this.onMessage(event)
      }

      // Flag to track if an error has occurred, to prevent duplicate close handling
      this.isClosingDueToError = false

      this.ws.onerror = event => {
        // Mark that we're handling an error-related closure
        this.isClosingDueToError = true
        this.onError(event)
      }

      return null
    } catch (error) {
      // Clean up on error
      if (this.ws) {
        this.closeConnection()
      }
      return new Error(`Failed to create WebSocket: ${error}`)
    }
  }

  public sendMessage(message: ClientMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const identity = getIdentity()
        if (!identity && !(message as UpdateIdentityMessage).content?.identity) {
          throw new Error('Identity not found')
        }
        if (message.type === ClientMessageType.UPDATE_IDENTITY) {
          const bytes = JSON.stringify({ ...message, identity })
          this.ws.send(bytes)
          return
        }
        const identifiedMessage = { ...message, identity }
        const bytes = JSON.stringify(identifiedMessage)
        this.ws.send(bytes)
      } catch (error) {
        throw error
      }
    } else {
      throw new Error('WebSocket is not available or is closed')
    }
  }

  public getReadyState(): number {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED
  }

  public closeConnection() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      // Remove event handlers to prevent any callbacks after closing
      this.ws.onopen = null
      this.ws.onclose = null
      this.ws.onmessage = null
      this.ws.onerror = null

      try {
        this.ws.close()
      } catch (e) {}

      this.ws = null
    }
  }
}
