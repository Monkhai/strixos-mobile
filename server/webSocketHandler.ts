import { getIdentity } from '@/storage/secureStorage'
import { ClientMessage, ClientMessageType } from './messageTypes'

export class WebSocketHandler {
  private onOpen: () => void
  private onClose: () => void
  private onMessage: (event: MessageEvent) => void
  private onError: (event: Event) => void
  private ws: WebSocket | null = null

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
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.ws = new WebSocket(path)
      this.ws.onopen = this.onOpen
      this.ws.onclose = this.onClose
      this.ws.onmessage = this.onMessage
      this.ws.onerror = this.onError
      return null
    } else {
      return Error('WebSocket is already connected or connecting.')
    }
  }

  public async sendMessage(message: ClientMessage): Promise<void> {
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
      try {
        const identity = await getIdentity()
        if (!identity) {
          throw new Error('Identity not found')
        }
        if (message.type === ClientMessageType.UPDATE_IDENTITY) {
          const bytes = JSON.stringify({ ...message, identity })
          console.log(message, 'message')
          this.ws.send(bytes)
          return
        }
        const identifiedMessage = { ...message, identity }
        const bytes = JSON.stringify(identifiedMessage)
        this.ws.send(bytes)
      } catch (error) {
        console.error('Error sending message:', error)
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
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
