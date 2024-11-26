import { Colors } from '@/constants/Colors'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React, { ReactNode } from 'react'
import { GestureResponderEvent, Pressable, PressableProps, StyleSheet, Text, useColorScheme, View } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Loader from './Loader'
import { Gesture, GestureDetector, RectButton } from 'react-native-gesture-handler'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface Props extends PressableProps {
  type?: 'primary' | 'danger' | 'secondary'
  wide?: boolean
  fullWidth?: boolean
  isLoading?: boolean
  suffix?: ReactNode
  prefix?: ReactNode
}
export default function UIButton({
  type = 'primary',
  fullWidth = false,
  wide = false,
  isLoading = false,
  prefix,
  suffix,
  style,
  children,
  ...props
}: Props) {
  const theme = useColorScheme()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const styles = StyleSheet.create({
    base: {
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : wide ? '50%' : 'auto',
      borderWidth: 2,
      minWidth: 100,
      opacity: props.disabled ? 0.5 : 1,
    },
    primary: {
      backgroundColor: Colors[theme ?? 'light'].primary,
      borderColor: Colors[theme ?? 'light'].primary,
    },
    secondary: {
      borderColor: Colors[theme ?? 'light'].primary,
    },
    danger: {
      backgroundColor: Colors[theme ?? 'light'].danger,
      borderColor: Colors[theme ?? 'light'].danger,
    },
  })

  const typedStyles = {
    primary: {
      ...styles.base,
      ...styles.primary,
    },
    secondary: {
      ...styles.base,
      ...styles.secondary,
    },
    danger: {
      ...styles.base,
      ...styles.danger,
    },
  }

  return (
    <AnimatedPressable
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light)
        scale.value = withTiming(0.95)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
      }}
      style={[animatedStyle, typedStyles[type], style]}
      {...props}
    >
      <>{children}</>
      <View style={{ position: 'absolute', right: 20 }}>{isLoading ? <Loader size={24} /> : suffix}</View>
    </AnimatedPressable>
  )
}

export function TextButton({ label, type = 'primary', ...props }: Props & { label: string }) {
  const theme = useColorScheme()
  const styles = StyleSheet.create({
    primary: {
      color: 'white',
    },
    secondary: {
      color: Colors[theme ?? 'light'].primary,
      fontWeight: 'semibold',
    },
    danger: {
      color: 'white',
    },
  })

  return (
    <UIButton style={{ paddingHorizontal: 8 }} type={type} {...props}>
      <Text
        numberOfLines={1}
        style={[
          {
            fontSize: 17,
          },
          styles[type],
        ]}
      >
        {label}
      </Text>
    </UIButton>
  )
}

interface IconButtonProps extends PressableProps {
  rotate?: boolean
}
export function IconButton({ rotate, style, ...props }: IconButtonProps) {
  const scale = useSharedValue(1)
  const degrees = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    if (rotate) {
      return {
        transform: [{ scale: scale.value }, { rotate: `${degrees.value}deg` }],
      }
    }
    return {
      transform: [{ scale: scale.value }],
    }
  })

  function handlePressIn(e: GestureResponderEvent) {
    impactAsync(ImpactFeedbackStyle.Light)
    scale.value = withTiming(0.95)
    degrees.value = withTiming(45)
    props.onPressIn?.(e)
  }

  function handlePressOut(e: GestureResponderEvent) {
    scale.value = withTiming(1)
    degrees.value = withTiming(0)
    props.onPressOut?.(e)
  }

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(props.onPress as any)

  return (
    <GestureDetector gesture={tap}>
      <AnimatedPressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={[animatedStyle, style]} {...props} />
    </GestureDetector>
  )
}
