import React from 'react'
import { Button, StyleSheet, View } from 'react-native'
import BoardComponent from './Board'
import { getEmptyBoard } from './utils'
import { Board } from '@/server/gameTypes'
import { ThemedText } from '@/components/ThemedText'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import LoadingMarks from '@/components/ui/LoadingMarks'

export default function LoaderBoard() {
  const [board, setBoard] = React.useState(getEmptyBoard())

  React.useEffect(() => {
    let lastRow = -1
    let lastCol = -1
    let mark = 'x'

    const interval = setInterval(() => {
      setBoard(board => {
        const newBoard = board.map(row => row.map(cell => ({ ...cell, value: '-' })))
        let row, col

        do {
          row = Math.floor(Math.random() * board.length)
          col = Math.floor(Math.random() * board[0].length)
        } while (row === lastRow && col === lastCol)

        newBoard[row][col].value = mark
        lastRow = row
        lastCol = col
        mark = mark === 'x' ? 'o' : 'x'

        return newBoard as Board
      })
    }, 750)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{ alignItems: 'center', gap: 20 }} exiting={FadeOut}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
          <ThemedText type="subtitle">Looking for an opponent</ThemedText>
          <LoadingMarks />
        </View>
        <BoardComponent isDisabled board={board} onMove={() => {}} />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({})
