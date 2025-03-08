import { ThemedText } from '@/components/ThemedText'
import { GameState } from '@/server/gameTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { SingleGameState, useSingleGameStore } from '@/stores/singleGameStore'
import { View } from 'react-native'
import SingleGameFinishedHeader from './components/SingleGameFinishedHeader'
import { SingleGamePlayingHeader } from './components/SingleGamePlayingHeader'

export default function SingleGameViewHeader() {
  return (
    <View style={{ flex: 1, gap: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <HeaderTitle />
    </View>
  )
}

function HeaderTitle() {
  const { gameState } = useSingleGameStore()

  switch (gameState) {
    case SingleGameState.FINISHED: {
      return <SingleGameFinishedHeader />
    }
    case SingleGameState.PLAYING: {
      return <SingleGamePlayingHeader />
    }
    default: {
      return <ThemedText type="title">Game</ThemedText>
    }
  }
}
