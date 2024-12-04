import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Canvas, FitBox, LinearGradient, Path, Skia } from '@shopify/react-native-skia'
import { PrimaryColors } from '@/constants/Colors'

export default function ShareIcon() {
  const theme = useColorScheme() ?? 'light'
  const whole = 52
  const zero = 8

  const quarter = whole / 4 + 4
  const fiveSixteenths = whole * 0.3125 + 4
  const half = whole / 2 + 4
  const fiveEigths = whole * 0.625 + 4
  const threeQuarters = whole * 0.75 + 4

  const sharePath = Skia.Path.Make()
    .moveTo(zero, half)
    .lineTo(zero, whole)
    .lineTo(whole, whole)
    .lineTo(whole, half)
    // arrow
    .moveTo(half, 4)
    .lineTo(half, fiveEigths)
    .moveTo(half, 4)
    .lineTo(quarter, fiveSixteenths)
    .moveTo(half, 4)
    .lineTo(threeQuarters, fiveSixteenths)

  const start = Skia.Point(zero, whole)
  const end = Skia.Point(whole, zero)

  return (
    <Canvas style={{ width: 48, height: 48 }}>
      <FitBox src={{ x: 0, y: 0, height: 60, width: 60 }} dst={{ x: 8, y: 8, height: 32, width: 32 }}>
        <Path path={sharePath} style="stroke" strokeWidth={4} color="white" strokeCap="round" strokeJoin="round">
          <LinearGradient colors={[PrimaryColors[theme].x.primary, PrimaryColors[theme].o.primary]} start={start} end={end} />
        </Path>
      </FitBox>
    </Canvas>
  )
}
