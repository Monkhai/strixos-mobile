import { ThemedText } from '@/components/ThemedText'
import { GameState } from '@/server/gameTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { View } from 'react-native'
import FinishedHeader from './FinishedHeader'
import { PlayingHeader } from './PlayingHeader'

export default function GameViewHeader() {
  return (
    <View style={{ flex: 1, gap: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <HeaderTitle />
    </View>
  )
}

function HeaderTitle() {
  const { gameState, opponentIdentity } = useGlobalStore()

  switch (gameState) {
    case GameState.FINISHED: {
      return <FinishedHeader />
    }
    case GameState.OPPONENT_DISCONNECTED: {
      return <ThemedText type="title">Oh no! {opponentIdentity?.displayName || 'opponent'} disconnected</ThemedText>
    }
    case GameState.PLAYING: {
      return <PlayingHeader />
    }
    default: {
      return <ThemedText type="title">Game</ThemedText>
    }
  }
}
