import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Canvas, Fill, Path, Shadow, Skia, SkiaDomView } from '@shopify/react-native-skia'
import { Colors } from '@/constants/Colors'
import { useSharedValue } from 'react-native-reanimated'

export default function HomeViewBody() {
  const dimensions = useSharedValue({ width: 0, height: 0 })
  const path = Skia.Path.Make()
    .moveTo(dimensions.value.width / 4, dimensions.value.height / 4)
    .lineTo(dimensions.value.width * 0.75, dimensions.value.height * 0.75)
    .moveTo(dimensions.value.width * 0.75, dimensions.value.height / 4)
    .lineTo(dimensions.value.width / 4, dimensions.value.height * 0.75)

  return (
    <View style={{ flex: 1, width: '100%', justifyContent: 'center', borderWidth: 1, alignItems: 'center' }}>
      <Canvas onSize={dimensions} style={{ flex: 1, width: '100%' }}>
        <Path style={'stroke'} path={path} color={Colors.light.primary} strokeWidth={20}>
          <Shadow dx={0} dy={50} color={'rgba(0, 0, 0, 0.5)'} blur={30} />
        </Path>
      </Canvas>
    </View>
  )
}
