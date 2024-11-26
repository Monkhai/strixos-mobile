import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { GameState } from '@/server/gameTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { useColorScheme, View } from 'react-native'
import MarkPath from './MarkPath'
import { smallCircle, smallXPath } from './MarkPathConstant'
import Avatar from '@/components/ui/Avatar'

const markToPathMap = {
  x: smallXPath,
  o: smallCircle,
  unknown: smallXPath,
}

export default function GameViewHeader() {
  const { identity } = useGlobalStore()
  return (
    <View style={{ flex: 1, gap: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <Avatar avatar={identity?.avatar ?? 'unknown'} />
        <ThemedText type="title">{identity?.displayName}</ThemedText>
      </View>
      <HeaderTitle />
    </View>
  )
}

function HeaderTitle() {
  const { gameState, identity, gameWinner, mark, activePlayer } = useGlobalStore()
  const theme = useColorScheme()

  const isMyTurn = identity?.id === activePlayer?.id

  switch (gameState) {
    case GameState.FINISHED: {
      if (identity?.id === gameWinner?.id) {
        return (
          <ThemedText type="title" style={{ padding: 4 }}>
            You win 🥳
          </ThemedText>
        )
      } else {
        return (
          <ThemedText type="title" style={{ padding: 4 }}>
            You lost 😢
          </ThemedText>
        )
      }
    }
    case GameState.OPPONENT_DISCONNECTED: {
      return <ThemedText type="title">Player disconnected</ThemedText>
    }
    case GameState.FINISHED: {
      return <ThemedText type="title">You are {mark}</ThemedText>
    }
    case GameState.PLAYING: {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {isMyTurn ? <ThemedText type="title">You're up</ThemedText> : <ThemedText type="title">Opponent is playing</ThemedText>}
          <MarkPath path={markToPathMap[mark]} color={Colors[theme ?? 'light'][isMyTurn ? 'primary' : 'danger']} />
        </View>
      )
    }
    default: {
      return <ThemedText type="title">Game</ThemedText>
    }
  }
}
