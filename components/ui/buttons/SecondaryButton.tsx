import { PrimaryColors } from '@/constants/Colors'
import { Canvas, LinearGradient, Paragraph, RoundedRect, Skia, SkParagraphStyle, TextAlign, TileMode } from '@shopify/react-native-skia'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { useMemo } from 'react'
import { useColorScheme, View } from 'react-native'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useElementDimensions } from '../hooks/useElementDImensions'
import Loader from '../Loader'
import { AnimatedPressable, ButtonProps, getButtonBaseStyle } from './constants'

export default function SecondaryButton({
  fullWidth = false,
  wide = false,
  isLoading = false,
  prefix,
  suffix,
  style,
  children,
  label,
  ...props
}: ButtonProps) {
  const theme = useColorScheme() ?? 'light'
  const scale = useSharedValue(1)
  const { h, w, ref } = useElementDimensions()

  const styles = useMemo(() => getButtonBaseStyle(fullWidth, wide, props.disabled), [fullWidth, wide, props.disabled])
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const foregroundPaint = Skia.Paint()
  foregroundPaint.setShader(
    Skia.Shader.MakeLinearGradient(
      { x: 0, y: h },
      { x: w * 1.3, y: 0 },
      [Skia.Color(PrimaryColors[theme].x.primary), Skia.Color(PrimaryColors[theme].o.primary)],
      null,
      TileMode.Clamp
    )
  )

  const paragraphStyle: SkParagraphStyle = {
    textAlign: TextAlign.Center,
  }
  const paragraph = Skia.ParagraphBuilder.Make(paragraphStyle)
    .pushStyle(
      {
        fontSize: 17,
        fontStyle: { weight: 600 },
        color: Skia.Color('white'),
      },
      foregroundPaint
    )
    .addText(label)
    .pop()
    .build()

  return (
    <AnimatedPressable
      ref={ref}
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light)
        scale.value = withTiming(0.95)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
      }}
      style={[animatedStyle, styles.base, style]}
      {...props}
    >
      <Canvas style={{ position: 'absolute', width: w, height: h }}>
        <RoundedRect r={8} height={h} width={w} x={0} y={0} style={'stroke'} strokeWidth={4}>
          <LinearGradient
            colors={[PrimaryColors[theme].x.primary, PrimaryColors[theme].o.primary]}
            start={{ x: 0, y: h }}
            end={{ x: w * 1.5, y: 0 }}
          />
        </RoundedRect>
        <Paragraph paragraph={paragraph} x={0} y={h / 3} width={w} />
      </Canvas>
      <View style={{ position: 'absolute', right: 20 }}>{isLoading ? <Loader size={24} /> : suffix}</View>
    </AnimatedPressable>
  )
}
