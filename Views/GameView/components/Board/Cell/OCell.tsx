import { GameState } from '@/server/gameTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { Canvas, LinearGradient, Oval, Path, Shadow, Skia, vec } from '@shopify/react-native-skia'
import React, { useEffect, useMemo } from 'react'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated'

interface Props {
  isPlaying: boolean
  containerSize?: number
  dying: boolean
}

const colors = {
  primary: '#F66E28',
  secondary: '#F1DE74',
  shadow: '#F66E2820',
}

export default function OCell({ dying, containerSize = 50, isPlaying }: Props) {
  const { gameState } = useGlobalStore()
  const v = useSharedValue(0)
  const containerOpacity = useSharedValue(1)
  const size = useMemo(() => containerSize * 2, [containerSize])
  const shadowOpacity = useDerivedValue(() => {
    return v.value * 0.4
  })

  const o = Skia.Path.Make().addCircle(size / 2, size * 0.4, size / 2 - containerSize / 2)

  const start = useDerivedValue(() => {
    return vec(size * 0.25, size * 0.75)
  })

  const end = useDerivedValue(() => {
    return vec(size * 0.75, size * 0.25)
  })

  const cy = useDerivedValue(() => {
    return size * 0.45
  })

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: v.value }],
      opacity: containerOpacity.value,
    }
  })

  useEffect(() => {
    v.value = withSpring(1)
  }, [])

  useEffect(() => {
    if (dying && isPlaying) {
      containerOpacity.value = withRepeat(withTiming(0.3, { duration: 800 }), -1, true)
    } else {
      containerOpacity.value = withTiming(1)
    }
  }, [dying, isPlaying])

  return (
    <Animated.View style={[{ height: size, width: size, paddingTop: containerSize * 0.15 }, style]}>
      <Canvas style={[{ height: size, width: size }]}>
        <Oval
          x={containerSize * 0.3}
          y={cy}
          width={containerSize * 1.4}
          height={containerSize * 0.8}
          opacity={shadowOpacity}
          style={'fill'}
        >
          <Shadow shadowOnly blur={containerSize * 0.15} color={colors.primary} dx={0} dy={0} />
        </Oval>
        <Path path={o} strokeWidth={containerSize / 2} style={'stroke'}>
          <Shadow blur={containerSize * 0.15} color={colors.shadow} dx={0} dy={containerSize * 0.4} />
          <LinearGradient colors={[colors.primary, colors.secondary]} start={start} end={end} />
        </Path>
      </Canvas>
    </Animated.View>
  )
}
