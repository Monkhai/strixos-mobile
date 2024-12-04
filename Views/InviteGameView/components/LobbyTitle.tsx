import { PrimaryColors } from '@/constants/Colors'
import { Canvas, Group, Oval, Paragraph, Shadow, Skia, TextAlign, TileMode, useFonts } from '@shopify/react-native-skia'
import React from 'react'
import { useColorScheme } from 'react-native'

export default function LobbyTitle() {
  const theme = useColorScheme() ?? 'light'
  const fonts = useFonts({
    babekFont: [require('@/assets/fonts/BakbakOne-Regular.ttf')],
  })

  if (!fonts) return null

  const foregroundPaint = Skia.Paint()
  foregroundPaint.setShader(
    Skia.Shader.MakeLinearGradient(
      { x: 75, y: 0 },
      { x: 245, y: 0 },
      [Skia.Color(PrimaryColors[theme].x.primary), Skia.Color(PrimaryColors[theme].o.primary)],
      null,
      TileMode.Clamp
    )
  )

  const paragraph = Skia.ParagraphBuilder.Make({ textAlign: TextAlign.Center }, fonts)
    .pushStyle(
      {
        fontFamilies: ['babekFont'],
        fontSize: 32,
        fontStyle: { weight: 500 },
        letterSpacing: 0.5,
        color: Skia.Color('white'),
      },
      foregroundPaint
    )
    .addText('Play With A Friend')
    .pop()
    .build()

  return (
    <Canvas style={{ width: 300, height: 100, marginBottom: -20 }}>
      <Group opacity={0.8} blendMode={'overlay'}>
        <Oval opacity={0.5} x={0} y={35} width={190} height={10} style={'fill'}>
          <Shadow shadowOnly blur={10} color={PrimaryColors[theme].x.primary} dx={0} dy={0} />
        </Oval>
        <Oval opacity={0.5} x={110} y={35} width={190} height={10} style={'fill'}>
          <Shadow shadowOnly blur={10} color={PrimaryColors[theme].o.primary} dx={0} dy={0} />
        </Oval>
      </Group>
      <Paragraph paragraph={paragraph} x={0} y={0} width={300} />
    </Canvas>
  )
}
