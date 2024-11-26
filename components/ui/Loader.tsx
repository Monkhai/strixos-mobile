import { Canvas, Circle } from '@shopify/react-native-skia'
import React, { useEffect } from 'react'
import { Easing, runOnUI, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated'

const ANIMATION_DURATION = 1200
const DELAY_BETWEEN_ANIMATIONS = 200
const CIRCLES_COUNT = 5

const SIZE = 30

interface Props {
  size?: number
  circlesCount?: number
  delayBetweenAnimations?: number
  animationDuration?: number
  color?: string
}

export default function Loader({
  size = SIZE,
  circlesCount = CIRCLES_COUNT,
  delayBetweenAnimations = DELAY_BETWEEN_ANIMATIONS,
  animationDuration = ANIMATION_DURATION,
  color = 'white',
}: Props) {
  const radius = size / 10
  const orbit = size * 0.4
  const center = size / 2
  const delayBetweenCycles = calculateTotalDuration(circlesCount, delayBetweenAnimations, animationDuration)
  const rotations = Array.from({ length: circlesCount }, () => useSharedValue(0))
  const xs = Array.from({ length: circlesCount }, () => useSharedValue(center))
  const ys = Array.from({ length: circlesCount }, () => useSharedValue(center))
  const opacities = Array.from({ length: circlesCount }, (_, i) => i / (circlesCount - 1)).reverse()

  useEffect(() => {
    rotations.forEach((rotation, i) => {
      rotation.value = withDelay(
        i * delayBetweenAnimations,
        withRepeat(
          withSequence(
            withTiming(2 * Math.PI, {
              duration: animationDuration,
              easing: Easing.linear,
            }),
            withDelay(delayBetweenCycles - animationDuration + 200, withTiming(0, { duration: 0 }))
          ),
          -1,
          false
        )
      )
    })
  }, [])

  useEffect(() => {
    rotations.forEach((rotation, i) => {
      runOnUI(() => {
        'worklet'
        rotation.addListener(i, value => {
          const angle = (value % (2 * Math.PI)) - Math.PI / 2
          xs[i].value = center + orbit * Math.cos(angle)
          ys[i].value = center + orbit * Math.sin(angle)
        })
      })()
    })

    return () => {
      rotations.forEach((rotation, i) => {
        runOnUI(() => {
          'worklet'
          rotation.removeListener(i)
        })()
      })
    }
  }, [])

  return (
    <Canvas style={{ width: size, height: size }}>
      {Array.from({ length: circlesCount }).map((_, i) => (
        <Circle opacity={opacities[i]} cx={xs[i]} cy={ys[i]} r={radius} style="fill" color={color} key={i} />
      ))}
    </Canvas>
  )
}

function calculateTotalDuration(n: number, delayBetweenAnimations: number, animationDuration: number) {
  const totalDuration = delayBetweenAnimations * (n - 1) + animationDuration
  return totalDuration
}
