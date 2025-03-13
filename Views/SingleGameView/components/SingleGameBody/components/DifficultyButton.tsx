import { View, Text, useColorScheme } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SingleGameDifficulty } from '@/lib/singleGame/singleGame'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Canvas, Group, Oval, Paragraph, Shadow, Skia, TextAlign, TileMode } from '@shopify/react-native-skia'
import { PrimaryColors } from '@/constants/Colors'
import { GeneralButton } from '@/components/ui/UIButton'

const PADDING = 30

interface Props {
  difficulty: SingleGameDifficulty
  onPress: () => void
  isSelected: boolean
}

export default function DifficultyButton({ difficulty, onPress, isSelected }: Props) {
  const theme = useColorScheme() ?? 'light'
  const blur = useSharedValue(0)
  const opacity = useSharedValue(0.4)
  const shadowOpacity = useSharedValue(0.5)
  const [textWidth, setTextWidth] = useState(0)

  useEffect(() => {
    if (isSelected) {
      blur.value = withTiming(0)
      opacity.value = withTiming(1)
      shadowOpacity.value = withTiming(0.7)
    } else {
      blur.value = withTiming(2)
      opacity.value = withTiming(0.4)
      shadowOpacity.value = withTiming(0.5)
    }
  }, [isSelected])

  const p = useMemo(() => {
    const foregroundPaint = Skia.Paint()
    foregroundPaint.setShader(
      Skia.Shader.MakeLinearGradient(
        { x: 0, y: 0 },
        { x: textWidth, y: 0 },
        [Skia.Color(PrimaryColors[theme].x.primary), Skia.Color(PrimaryColors[theme].o.primary)],
        null,
        TileMode.Clamp
      )
    )
    const p = Skia.ParagraphBuilder.Make({ textAlign: TextAlign.Center })
      .pushStyle(
        {
          color: Skia.Color('white'),
          fontSize: 32,
        },
        foregroundPaint
      )
      .addText(capitalize(difficulty))
      .build()

    p.layout(200)
    setTextWidth(p.getLongestLine())

    return p
  }, [difficulty, textWidth])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  const width = p.getLongestLine() + 10
  const height = p.getHeight()

  return (
    <GeneralButton onPress={onPress} style={animatedStyle}>
      <Canvas style={{ width: width + PADDING, height: height + PADDING }}>
        <Group transform={[{ translateX: PADDING / 2 }, { translateY: PADDING / 2 }]}>
          <Group opacity={shadowOpacity}>
            <Oval opacity={0.4} x={0} y={0} width={width * 0.66} height={height} style={'fill'}>
              <Shadow shadowOnly blur={10} color={PrimaryColors[theme].x.primary} dx={0} dy={0} />
            </Oval>
            <Oval opacity={0.4} x={width * 0.33} y={0} width={width * 0.66} height={height} style={'fill'}>
              <Shadow shadowOnly blur={10} color={PrimaryColors[theme].o.primary} dx={0} dy={0} />
            </Oval>
          </Group>
          <Paragraph paragraph={p} x={0} y={0} width={width} />
        </Group>
      </Canvas>
    </GeneralButton>
  )
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
