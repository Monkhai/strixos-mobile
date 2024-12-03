import { Colors } from '@/constants/Colors'
import { GameState } from '@/server/gameTypes'
import { useGlobalStore } from '@/stores/globalStore'
import { Canvas, LinearGradient, Oval, Path, Shadow, Skia, usePathInterpolation, vec } from '@shopify/react-native-skia'
import React, { useEffect, useMemo } from 'react'
import { Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated'

interface Props {
  containerSize?: number
  dying: boolean
}

const colors = {
  primary: '#3973FF',
  secondary: '#89DFCF',
  shadow: '#3973FF20',
}

export default function XCell({ dying, containerSize = 50 }: Props) {
  const { gameState } = useGlobalStore()
  const v = useSharedValue(0)
  const containerOpacity = useSharedValue(1)
  const size = useMemo(() => containerSize * 2, [containerSize])
  const shadowOpacity = useDerivedValue(() => {
    return v.value * 0.4
  })
  const x = Skia.Path.Make()
    .moveTo(size * 0.25, size * 0.15)
    .lineTo(size * 0.75, size * 0.65)
    .moveTo(size * 0.75, size * 0.15)
    .lineTo(size * 0.25, size * 0.65)

  const dash = Skia.Path.Make()
    .moveTo(size * 0.25, size * 0.4)
    .lineTo(size * 0.75, size * 0.4)
    .moveTo(size * 0.75, size * 0.4)
    .lineTo(size * 0.25, size * 0.4)

  const start = useDerivedValue(() => {
    return vec(size * 0.25, size * 0.75)
  })

  const end = useDerivedValue(() => {
    return vec(size * 0.75, size * 0.25)
  })

  const cy = useDerivedValue(() => {
    return size * 0.45
  })

  const path = usePathInterpolation(v, [0, 1], [dash, x])

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
    if (dying && gameState === GameState.PLAYING) {
      containerOpacity.value = withRepeat(withTiming(0.3, { duration: 800 }), -1, true)
    } else {
      containerOpacity.value = withTiming(1)
    }
  }, [dying, gameState])

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
          color={Colors.light.primary}
        >
          <Shadow shadowOnly blur={containerSize * 0.15} color={colors.primary} dx={0} dy={0} />
        </Oval>
        <Path path={path} strokeWidth={containerSize / 2} style={'stroke'}>
          <Shadow blur={containerSize * 0.15} color={colors.shadow} dx={0} dy={containerSize * 0.4} />
          <LinearGradient colors={[colors.primary, colors.secondary]} start={start} end={end} />
        </Path>
      </Canvas>
    </Animated.View>
  )
}
