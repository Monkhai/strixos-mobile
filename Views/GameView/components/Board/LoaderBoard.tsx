import React from 'react'
import { Button, StyleSheet, View } from 'react-native'
import BoardComponent from './Board'
import { getEmptyBoard } from './utils'
import { Board } from '@/server/gameTypes'
import { ThemedText } from '@/components/ThemedText'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import LoadingMarks from '@/components/ui/LoadingMarks'
import { Mark } from './Cell/constants'

interface Props {
  hideCells?: boolean
}
export default function LoaderBoard({ hideCells = false }: Props) {
  const [board, setBoard] = React.useState(getEmptyBoard())

  React.useEffect(() => {
    let mark: Mark = 'x'

    let lastRow = -1
    let lastCol = -1
    let lastMark: Mark = 'o'

    let secondLastRow = -1
    let secondLastCol = -1

    const interval = setInterval(() => {
      setBoard(board => {
        const newBoard = getEmptyBoard()
        let row, col

        do {
          row = Math.floor(Math.random() * board.length)
          col = Math.floor(Math.random() * board[0].length)
        } while ((row === lastRow && col === lastCol) || (row === secondLastRow && col === secondLastCol))

        if (lastRow !== -1 && lastCol !== -1) {
          newBoard[lastRow][lastCol].value = lastMark
          if (hideCells) {
            newBoard[lastRow][lastCol].winState = true
          }
        }
        newBoard[row][col].value = mark
        if (hideCells) {
          newBoard[row][col].winState = true
        }

        secondLastRow = lastRow
        secondLastCol = lastCol
        lastRow = row
        lastCol = col
        lastRow = row
        lastCol = col
        lastMark = mark

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
      <BoardComponent hideCells={hideCells} isDisabled board={board} onMove={() => {}} />
    </Animated.View>
  )
}
