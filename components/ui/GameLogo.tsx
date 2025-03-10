import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import XCell from '@/Views/GameView/components/Board/Cell/XCell'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import OCell from '@/Views/GameView/components/Board/Cell/OCell'

export default function GameLogo() {
  const degrees = useSharedValue(35)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${degrees.value}deg` }],
  }))

  useEffect(() => {
    degrees.value = withTiming(0)
  }, [])
  return (
    <Animated.View style={[{ flexDirection: 'row', width: 150, height: 120 }, animatedStyle]}>
      <View style={{ position: 'absolute', left: -15 }}>
        <XCell dying={false} containerSize={50} isPlaying={false} />
      </View>
      <View style={{ position: 'absolute', right: -15 }}>
        <OCell dying={false} containerSize={50} isPlaying={false} />
      </View>
    </Animated.View>
  )
}
