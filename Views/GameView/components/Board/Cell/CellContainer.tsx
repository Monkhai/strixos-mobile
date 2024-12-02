import { RowMark } from '@/server/gameTypes'
import React, { useEffect } from 'react'
import { Pressable, StyleSheet, useColorScheme } from 'react-native'
import { SIZE } from './constants'
import OCell from './OCell'
import XCell from './XCell'
import { PrimaryColors } from '@/constants/Colors'
import { AnimatedPressable } from '@/components/ui/buttons/constants'
import { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface Props {
  value: RowMark
  onPress: () => void
  win: boolean
  lives: number
  isDisabled: boolean
}

export default function CellContainer({ lives, onPress, value, win, isDisabled }: Props) {
  const theme = useColorScheme() ?? 'light'
  const val = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: win
      ? interpolateColor(
          val.value,
          [0, 1, 2],
          [PrimaryColors[theme].x.primary, PrimaryColors[theme]['-'].primary, PrimaryColors[theme].o.primary]
        )
      : PrimaryColors[theme]['-'].primary,
  }))

  useEffect(() => {
    val.value = withTiming(valueToNumber[value])
  }, [value])

  return (
    <AnimatedPressable
      onPress={() => {
        onPress()
      }}
      style={[{ backgroundColor: win ? PrimaryColors[theme][value].shadow : 'transparent' }, animatedStyle, styles.container]}
    >
      <Cell lives={lives} value={value} />
    </AnimatedPressable>
  )
}

function Cell({ lives, value }: { lives: number; value: RowMark }) {
  switch (value) {
    case 'o': {
      return <OCell dying={lives === 0} containerSize={50} />
    }
    case 'x': {
      return <XCell dying={lives === 0} containerSize={50} />
    }

    default: {
      return null
    }
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 4,
    width: SIZE,
    height: SIZE,
    borderWidth: 2,
    borderRadius: 4,
  },
})

const valueToNumber = {
  x: 0,
  '-': 1,
  o: 2,
}
