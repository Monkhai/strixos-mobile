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
  hideCell?: boolean
}

export default function CellContainer({ lives, onPress, value, win, hideCell = false }: Props) {
  const theme = useColorScheme() ?? 'light'
  const val = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      val.value,
      [0, 1, 2],
      [PrimaryColors[theme].x.primary, PrimaryColors[theme]['-'].primary, PrimaryColors[theme].o.primary]
    )
    return {
      borderColor: win ? borderColor : PrimaryColors[theme]['-'].primary,

      backgroundColor: interpolateColor(
        val.value,
        [0, 1, 2],
        [PrimaryColors[theme].x.shadow, 'transparent', PrimaryColors[theme].o.shadow]
      ),
    }
  })

  useEffect(() => {
    val.value = withTiming(valueToNumber[value], { duration: 500 })
  }, [value])

  return (
    <AnimatedPressable
      onPress={() => {
        onPress()
      }}
      style={[{}, animatedStyle, styles.container]}
    >
      {hideCell ? null : <Cell lives={lives} value={value} />}
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
