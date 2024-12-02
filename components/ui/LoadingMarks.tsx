import { Mark } from '@/server/gameTypes'
import OPath from '@/Views/GameView/components/Board/Cell/components/OPath'
import XPath from '@/Views/GameView/components/Board/Cell/components/XPath'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

export default function LoadingMarks() {
  const marks = Array.from({ length: 3 }).map(() => useState<Mark>('x'))
  const sharedMarks = Array.from({ length: 3 }).map(() => useSharedValue<Mark>('x'))
  const values = Array.from({ length: 3 }).map(() => useSharedValue(0))
  const styles = Array.from({ length: 3 }).map((_, i) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: values[i].value }],
    }))
  )

  useEffect(() => {
    values.forEach((v, i) => {
      //reset everything once
      v.value = 0
    })
    values.forEach((v, i) => {
      v.value = withDelay(
        300 * i,
        withRepeat(
          withSequence(
            withSpring(1, { duration: 750 }),
            withDelay(
              750,
              withTiming(0, { duration: 500 }, () => {
                const sharedMark = sharedMarks[i]
                const [, setMark] = marks[i]
                if (sharedMark.value === 'x') {
                  runOnJS(setMark)('o')
                  sharedMark.value = 'o'
                } else {
                  runOnJS(setMark)('x')
                  sharedMark.value = 'x'
                }
              })
            )
          ),
          -1,
          true
        )
      )
    })
  }, [])

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
      {values.map((v, i) => (
        <Animated.View key={i} style={styles[i]}>
          {marks[i][0] === 'x' ? <XPath containerSize={8} v={v} /> : <OPath containerSize={8} v={v} />}
        </Animated.View>
      ))}
    </View>
  )
}
