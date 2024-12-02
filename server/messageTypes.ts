import { Board, Mark } from './gameTypes'
import { Identity, SafeIdentity } from './playerTypes'

export enum ClientMessageType {
  MOVE = 'move',
  GAME_REQUEST = 'gameRequest',
  LEAVE_GAME = 'leaveGame',
  LEAVE_QUEUE = 'leaveQueue',
  UPDATE_IDENTITY = 'updateIdentity',
  CREATE_INVITE_GAME = 'createInviteGame',
  JOIN_INVITE_GAME = 'joinInviteGame',
  LEAVE_INVITE_GAME = 'leaveInviteGame',
}

export enum ServerMessageType {
  START_GAME = 'startGame',
  UPDATE = 'update',
  GAME_OVER = 'gameOver',
  GAME_CLOSED = 'gameClosed',
  ERROR = 'error',
  GAME_WAITING = 'gameWaiting',
  REMOVED_FROM_QUEUE = 'removedFromQueue',
  REMOVED_FROM_GAME = 'removedFromGame',
  OPPONENT_DISCONNECTED = 'opponentDisconnected',
  SERVER_DISCONNECTED = 'disconnectedFromServer',
  // Register Flow
  AUTH_IDENTITY = 'authIdentity',
  REGISTERED = 'registered',
  // Invite Game
  INVITE_GAME_CREATED = 'inviteGameCreated',
}

export interface BaseMessage {
  type: ClientMessageType | ServerMessageType
}

// -------------------Client Messages------------------

export interface ClientMessage extends BaseMessage {
  type: ClientMessageType
}
export interface GameRequestMessage extends ClientMessage {
  type: ClientMessageType.GAME_REQUEST
}
export const RequestGameMessage: GameRequestMessage = {
  type: ClientMessageType.GAME_REQUEST,
}
export interface JoinGameInviteMessage extends ClientMessage {
  type: ClientMessageType.JOIN_INVITE_GAME
  gameID: string
}
export interface CreateGameInviteMessage extends ClientMessage {
  type: ClientMessageType.CREATE_INVITE_GAME
}
export interface LeaveInviteGameMessage extends ClientMessage {
  type: ClientMessageType.LEAVE_INVITE_GAME
  gameID: string
}
export interface UpdateIdentityMessage extends ClientMessage {
  type: ClientMessageType.UPDATE_IDENTITY
  content: {
    identity: Identity
  }
}
export interface MoveMessage extends ClientMessage {
  type: ClientMessageType.MOVE
  content: {
    row: number
    col: number
    mark: string
  }
}
export const LeaveGameMessage: ClientMessage = {
  type: ClientMessageType.LEAVE_GAME,
}
export const LeaveQueueMessage: ClientMessage = {
  type: ClientMessageType.LEAVE_QUEUE,
}
// -------------------Server Messages------------------
export interface ServerMessage extends BaseMessage {
  type: ServerMessageType
}

export interface CloseMessage extends ServerMessage {
  type: ServerMessageType.GAME_CLOSED
  reason: string
}

export interface InviteGameCreatedMessage extends ServerMessage {
  type: ServerMessageType.INVITE_GAME_CREATED
  content: {
    gameID: string
  }
}

export interface StartGameMessage extends ServerMessage {
  type: ServerMessageType.START_GAME
  content: {
    board: Board
    mark: Mark
    activePlayer: SafeIdentity
    oponent: SafeIdentity
    gameID: string
  }
}

export interface UpdateMessage extends ServerMessage {
  type: ServerMessageType.UPDATE
  content: {
    board: Board
    activePlayer: SafeIdentity
  }
}

export interface GameOverMessage extends ServerMessage {
  type: ServerMessageType.GAME_OVER
  content: {
    board: Board
    winner: SafeIdentity
  }
}

export interface ErrorMessage extends ServerMessage {
  type: ServerMessageType.ERROR
  content: {
    message: string
  }
}

export interface GameWaitingMessage extends ServerMessage {
  type: ServerMessageType.GAME_WAITING
}
