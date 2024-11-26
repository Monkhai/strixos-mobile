import { ServerMessage, ServerMessageType } from './messageTypes'
import { Identity, InitialIdentity } from './playerTypes'

export interface InitialIdentityMessage extends ServerMessage {
  type: ServerMessageType.AUTH_IDENTITY
  content: {
    identity: InitialIdentity
  }
}

export interface RegisteredMessage extends ServerMessage {
  type: ServerMessageType.REGISTERED
  content: {
    identity: Identity
  }
}
