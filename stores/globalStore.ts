import { WS_URL } from '@/server/constants'
import { Board, GameState, Mark } from '@/server/gameTypes'
import {
  ClientMessageType,
  ErrorMessage,
  GameOverMessage,
  InviteGameCreatedMessage,
  InviteGameOverMessage,
  MoveMessage,
  ServerMessage,
  ServerMessageType,
  StartGameMessage,
  UpdateIdentityMessage,
  UpdateMessage,
} from '@/server/messageTypes'
import { Identity, SafeIdentity } from '@/server/playerTypes'
import { InitialIdentityMessage, RegisteredMessage } from '@/server/registerFlowMessages'
import { WebSocketHandler } from '@/server/webSocketHandler'
import { Preferences } from '@/storage/preferencesTypes'
import { getIdentity, getPreferences, setIdentity } from '@/storage/secureStorage'
import { getEmptyBoard } from '@/Views/GameView/components/Board/utils'
import { router } from 'expo-router'
import { create } from 'zustand'

interface StoreType {
  ws: WebSocketHandler | null
  identity: Identity | null
  opponentIdentity: SafeIdentity | null
  mark: Mark | 'unknown'
  activePlayer: SafeIdentity | null
  gameState: GameState
  board: Board
  connectionState: WebSocket['OPEN'] | WebSocket['CLOSED'] | WebSocket['CONNECTING'] | WebSocket['CLOSING']
  gameWinner: SafeIdentity | null
  error: string | null
  preferences: Preferences
  gameID: string | null
  newGameID: string | null
  isInviteGame: boolean
  reconnectionAttempts: number

  createWSConnection: (count: number) => void
  setWsHandler: (wsHandler: WebSocketHandler) => void
  resetAllStates: () => void
  sendMove: (row: number, col: number) => void
  resetError: () => void
  setPreferences: (preferences: Preferences) => void
}

export const useGlobalStore = create<StoreType>()((set, get) => ({
  //websocket
  ws: null,
  connectionState: WebSocket.CLOSED,
  reconnectionAttempts: 0,

  //game state
  activePlayer: null,
  board: getEmptyBoard(),
  mark: 'unknown',
  identity: null,
  opponentIdentity: null,
  gameState: GameState.NONE,
  gameWinner: null,
  error: null,
  preferences: {
    displayName: '',
    preferedAvatar: 'unknown',
  },
  gameID: null,
  newGameID: null,
  isInviteGame: false,

  //actions
  setPreferences(preferences) {
    set({ preferences })
    const identity = get().identity
    if (identity) {
      set({
        identity: {
          ...identity,
          avatar: preferences.preferedAvatar,
          displayName: preferences.displayName,
        },
      })

      const ws = get().ws
      if (ws) {
        if (ws.getReadyState() === WebSocket.OPEN) {
          const updateMessage: UpdateIdentityMessage = {
            type: ClientMessageType.UPDATE_IDENTITY,
            content: {
              identity: {
                id: identity.id,
                secret: identity.secret,
                avatar: preferences.preferedAvatar,
                displayName: preferences.displayName,
              },
            },
          }
          ws.sendMessage(updateMessage)
        }
      }
    }
  },
  resetAllStates() {
    const identity = getIdentity()
    if (identity) {
      set({ identity })
    }

    set({
      board: getEmptyBoard(),
      mark: 'unknown',
      activePlayer: null,
      gameState: GameState.NONE,
      opponentIdentity: null,
      gameWinner: null,
      error: null,
      gameID: null,
      newGameID: null,
      isInviteGame: false,
    })
  },

  resetError() {
    set({ error: null })
  },

  setWsHandler: wsHandler => set({ ws: wsHandler }),

  sendMove(row, col): void {
    const isMyTurn = get().identity?.id === get().activePlayer?.id
    if (!isMyTurn) {
      set({ error: 'Not your turn' })
      return
    }
    const moveMessage: MoveMessage = {
      type: ClientMessageType.MOVE,
      content: {
        row,
        col,
        mark: get().mark,
      },
    }
    void get().ws?.sendMessage(moveMessage)
  },

  createWSConnection(count: number = 0) {
    // Track reconnection attempts globally
    set({ reconnectionAttempts: count })

    // Don't create a new connection if one already exists
    const existingWs = get().ws
    if (existingWs) {
      // If there's an existing handler but it's closed, try to reconnect
      if (existingWs.getReadyState() === WebSocket.CLOSED) {
        const err = existingWs.connect(WS_URL)
        if (err) {
          console.error('[Store] Error reconnecting:', err)
        }
      }
      return
    }

    const ws = new WebSocketHandler({
      onError() {
        set({
          error: 'WebSocket Error Occurred',
          connectionState: WebSocket.CLOSED,
        })
      },
      onOpen() {
        set({
          connectionState: WebSocket.OPEN,
          error: null,
          reconnectionAttempts: 0,
        })
      },
      onClose() {
        const currentAttempts = get().reconnectionAttempts || 0
        set({
          connectionState: WebSocket.CLOSED,
          reconnectionAttempts: currentAttempts + 1,
        })

        set({
          board: getEmptyBoard(),
          mark: 'unknown',
          activePlayer: null,
          gameState: GameState.NONE,
          opponentIdentity: null,
          gameWinner: null,
          gameID: null,
          newGameID: null,
          isInviteGame: false,
        })
      },
      onMessage(event) {
        try {
          const message = JSON.parse(event.data) as ServerMessage

          switch (message.type) {
            case ServerMessageType.AUTH_IDENTITY: {
              const { content } = message as InitialIdentityMessage
              const preferences = getPreferences()
              if (!preferences) {
                console.error('[Store] No preferences found')
                return
              }
              set({ preferences })
              const updateMessage: UpdateIdentityMessage = {
                type: ClientMessageType.UPDATE_IDENTITY,
                content: {
                  identity: {
                    id: content.identity.id,
                    secret: content.identity.secret,
                    avatar: preferences.preferedAvatar,
                    displayName: preferences.displayName,
                  },
                },
              }
              ws.sendMessage(updateMessage)
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.REGISTERED: {
              const { content } = message as RegisteredMessage
              setIdentity(content.identity)
              set({
                identity: content.identity,
              })
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.START_GAME: {
              const { content } = message as StartGameMessage
              set({
                board: content.board,
                mark: content.mark,
                activePlayer: content.activePlayer,
                gameState: GameState.PLAYING,
                opponentIdentity: content.opponent,
                gameID: content.gameID,
              })
              router.dismissTo('/game', { withAnchor: true })
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.INVITE_GAME_CREATED: {
              const { content } = message as InviteGameCreatedMessage
              set({ gameID: content.gameID })
              router.replace(`/invite-game/lobby`)
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.INVITE_GAME_OVER: {
              const { content } = message as InviteGameOverMessage
              set({
                board: content.board,
                gameState: GameState.FINISHED,
                gameWinner: content.winner,
                newGameID: content.newGameID,
                isInviteGame: true,
              })
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.UPDATE: {
              const { content } = message as UpdateMessage
              set({
                board: content.board,
                activePlayer: content.activePlayer,
              })
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.GAME_CLOSED: {
              set({
                board: getEmptyBoard(),
                mark: 'unknown',
                activePlayer: null,
                gameState: GameState.OPPONENT_DISCONNECTED,
              })
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.GAME_OVER: {
              const { content } = message as GameOverMessage
              set({
                board: content.board,
                gameState: GameState.FINISHED,
                gameWinner: content.winner,
              })
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.GAME_WAITING: {
              set({ gameState: GameState.WAITING })
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.REMOVED_FROM_GAME: {
              get().resetAllStates()
              router.dismissTo('/home')
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.REMOVED_FROM_QUEUE: {
              get().resetAllStates()
              router.dismissTo('/home')
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.ERROR: {
              const { content } = message as ErrorMessage
              set({ error: content.message })
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.OPPONENT_DISCONNECTED: {
              set({ gameState: GameState.OPPONENT_DISCONNECTED })
              break
            }
            //--------------------------------------
            //--------------------------------------
            case ServerMessageType.SERVER_DISCONNECTED: {
              set({ error: 'Server disconnected' })
              get().resetAllStates()
              router.dismissTo('/home')
              break
            }
            //--------------------------------------
            //--------------------------------------
            default: {
            }
          }
        } catch (error) {
          set({ error: 'Error parsing message' })
        }
      },
    })
    if (get().connectionState === WebSocket.CLOSED) {
      set({ ws })
      ws.connect(WS_URL)
    }
  },
}))
