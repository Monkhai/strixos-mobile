import { Board, GameState } from '@/server/gameTypes'
import { View } from 'react-native'
import Cell from './Cell'

interface Props {
  board: Board
  isDisabled: boolean
  onMove: (row: number, col: number) => void
  hideCells?: boolean
  isPlaying: boolean
}
export default function BoardComponent({ board, onMove, isDisabled, hideCells = false, isPlaying }: Props) {
  return (
    <View style={{ flexDirection: 'column' }}>
      {board.map((row, rowIndex) => {
        return (
          <View key={rowIndex} style={{ flexDirection: 'row' }}>
            {row.map((cell, cellIndex) => {
              return (
                <Cell
                  isPlaying={isPlaying}
                  hideCell={hideCells}
                  key={cellIndex}
                  isDisabled={isDisabled || cell.value !== '-'}
                  lives={cell.lives}
                  onPress={() => onMove(rowIndex, cellIndex)}
                  value={cell.value}
                  win={cell.winState}
                />
              )
            })}
          </View>
        )
      })}
    </View>
  )
}
