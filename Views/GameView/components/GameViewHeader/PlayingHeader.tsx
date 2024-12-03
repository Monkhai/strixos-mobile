import Avatar from '@/components/ui/Avatar'
import { useGlobalStore } from '@/stores/globalStore'
import { useEffect, useMemo } from 'react'
import { StyleSheet, useColorScheme, View } from 'react-native'
import { SIZE } from '../Board/Cell/constants'
import { ThemedText } from '@/components/ThemedText'
import { Mark } from '@/server/gameTypes'
import { PrimaryColors } from '@/constants/Colors'
import { Canvas, Paragraph, Skia, TextAlign, TileMode } from '@shopify/react-native-skia'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import XPath from '../Board/Cell/components/XPath'
import OPath from '../Board/Cell/components/OPath'

export function PlayingHeader() {
  const { identity, opponentIdentity, mark } = useGlobalStore()
  const oppositeMark = mark === 'x' ? 'o' : 'x'

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20, paddingHorizontal: 20 }}>
      <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
        <View style={{ flex: 1, gap: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
            <Avatar size={SIZE / 3} avatar={identity?.avatar ?? 'unknown'} />
            <ThemedText type="subtitle">{identity?.displayName}</ThemedText>
          </View>
        </View>

        <View style={{ flex: 1, gap: 16, alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
            <Avatar size={SIZE / 3} avatar={opponentIdentity?.avatar ?? 'unknown'} />
            <ThemedText type="subtitle">{opponentIdentity?.displayName}</ThemedText>
          </View>
        </View>
      </View>

      <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <PlayerIndicator playerId={identity?.id ?? ''} mark={mark as Mark} />
        <VSText />
        <PlayerIndicator playerId={opponentIdentity?.id ?? ''} mark={oppositeMark} />
      </View>
    </View>
  )
}

function PlayerIndicator({ mark, playerId }: { mark: Mark; playerId: string }) {
  const { activePlayer } = useGlobalStore()
  const isTurn = useMemo(() => {
    return activePlayer?.id === playerId
  }, [activePlayer, playerId])
  const v = useSharedValue(1)
  const theme = useColorScheme() ?? 'light'
  const opacity = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  useEffect(() => {
    if (isTurn) {
      opacity.value = withTiming(1)
      return
    }
    if (!isTurn) {
      opacity.value = withTiming(0.3)
      return
    }
  }, [isTurn])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: PrimaryColors[theme][mark as Mark].shadow,
          borderColor: PrimaryColors[theme][mark as Mark].primary,
        },
        animatedStyle,
      ]}
    >
      {mark === 'x' ? <XPath v={v} containerSize={SIZE / 4} /> : mark === 'o' ? <OPath v={v} containerSize={SIZE / 4} /> : null}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: SIZE / 2,
    height: SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: (SIZE / 2) * 0.2,
    borderWidth: 2,
    borderRadius: SIZE / 4,
  },
})

function VSText() {
  const mark = useGlobalStore(state => state.mark)

  const theme = useColorScheme() ?? 'light'
  const colorsArray =
    mark === 'x'
      ? [PrimaryColors[theme].x.primary, PrimaryColors[theme].o.primary]
      : [PrimaryColors[theme].o.primary, PrimaryColors[theme].x.primary]

  const foregroundPaint = Skia.Paint()
  foregroundPaint.setShader(
    Skia.Shader.MakeLinearGradient(
      { x: 2, y: 0 },
      { x: 62, y: 0 },
      colorsArray.map(color => Skia.Color(color)),
      null,
      TileMode.Clamp
    )
  )

  const paragraph = Skia.ParagraphBuilder.Make({ textAlign: TextAlign.Center })
    .pushStyle(
      {
        fontFamilies: ['babekFont'],
        fontSize: 32,
        fontStyle: { weight: 800 },
        color: Skia.Color('white'),
      },
      foregroundPaint
    )
    .addText('VS')
    .pop()
    .build()

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Canvas style={{ width: 64, height: 32 }}>
        <Paragraph paragraph={paragraph} x={0} y={0} width={64} />
      </Canvas>
    </View>
  )
}
