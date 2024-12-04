import { PrimaryColors } from '@/constants/Colors'
import { Canvas, LinearGradient, Path, Skia } from '@shopify/react-native-skia'
import React from 'react'
import { useColorScheme } from 'react-native'

interface Props {
  h: number
  w: number
}
export default function BackIcon({ h, w }: Props) {
  const theme = useColorScheme() ?? 'light'
  const path = Skia.Path.Make().moveTo(14, 24).lineTo(28, 12).moveTo(14, 24).lineTo(28, 36)
  return (
    <Canvas style={{ height: h, width: w }}>
      <Path path={path} color={'white'} strokeWidth={4} strokeCap={'round'} strokeJoin={'round'} style={'stroke'}>
        <LinearGradient
          colors={[PrimaryColors[theme].x.primary, PrimaryColors[theme].o.primary]}
          start={{ x: w / 2, y: h }}
          end={{ x: w, y: 0 }}
        />
      </Path>
    </Canvas>
  )
}
