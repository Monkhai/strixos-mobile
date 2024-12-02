import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React, { ReactNode } from 'react'
import { PressableProps, StyleSheet } from 'react-native'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useElementDimensions } from '../hooks/useElementDImensions'
import { AnimatedPressable } from './constants'

interface Props {
  children: ReactNode | ((h: number, w: number) => ReactNode)
  onPress: () => void
  rotate?: boolean
}
export default function IconButton({ children, onPress, rotate }: Props) {
  const degrees = useSharedValue(0)
  const scale = useSharedValue(1)
  const { w, h, ref } = useElementDimensions()

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate ? degrees.value : 0}deg` }],
  }))

  return (
    <AnimatedPressable
      ref={ref}
      style={[styles.base, animatedStyle]}
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light)
        scale.value = withTiming(0.95)
        degrees.value = withTiming(rotate ? 45 : 0)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
        degrees.value = withTiming(0)
      }}
      onPress={onPress}
    >
      {typeof children === 'function' ? children(h, w) : children}
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    height: 48,
    width: 48,
  },
})
