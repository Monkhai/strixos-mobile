import { ReactNode } from 'react'
import { Pressable, PressableProps, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export interface ButtonProps extends PressableProps {
  wide?: boolean
  fullWidth?: boolean
  isLoading?: boolean
  suffix?: ReactNode
  prefix?: ReactNode
  label: string
}

export function getButtonBaseStyle(disabled?: boolean | undefined | null) {
  return StyleSheet.create({
    base: {
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
      borderRadius: 8,
      height: 48,
      minWidth: '50%',
    },
  })
}
