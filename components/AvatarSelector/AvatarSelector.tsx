import charactersMap from '@/assets/characters/avatarsMap'
import Avatar from '@/components/ui/Avatar'
import CustomBottomSheet from '@/components/ui/BottomSheet/BottomSheet'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { IconButton } from '@/components/ui/UIButton'
import { Colors } from '@/constants/Colors'
import { useGlobalStore } from '@/stores/globalStore'
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import React, { useCallback, useMemo, useRef } from 'react'
import { Keyboard, Platform, StyleSheet, useColorScheme, View } from 'react-native'
import SelectAvatarButton from './SelectAvatarButton'

interface Props {
  avatar: keyof typeof charactersMap
  onAvatarSelect: (avatar: keyof typeof charactersMap) => void
}

export default function AvatarSelector({ avatar, onAvatarSelect }: Props) {
  const { identity } = useGlobalStore()
  const theme = useColorScheme() ?? 'light'
  const snapPoints = useMemo(() => ['60%'], [])
  const bottomSheetRef = useRef<BottomSheet>(null)

  const renderItem = useCallback(({ item: avatar }: { item: keyof typeof charactersMap }) => {
    return (
      <SelectAvatarButton
        onAvatarSelect={() => {
          onAvatarSelect(avatar)
          bottomSheetRef.current?.close()
        }}
        avatar={avatar}
      />
    )
  }, [])

  return (
    <>
      <View style={{ width: 100, height: 100 }}>
        <Avatar size={100} avatar={avatar} />
        <IconButton
          onPress={() => {
            bottomSheetRef.current?.snapToIndex(0)
            Keyboard.dismiss()
          }}
          rotate
          style={styles.iconButton}
        >
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={Platform.select({
              ios: theme == 'dark' ? 50 : 100,
              android: 100,
            })}
            style={{ ...StyleSheet.absoluteFillObject }}
          />
          <IconSymbol name="pencil" size={24} color={theme === 'dark' ? 'white' : 'black'} />
        </IconButton>
      </View>

      <CustomBottomSheet bottomInset={0} bottomSheetRef={bottomSheetRef} snapPoints={snapPoints}>
        <BottomSheetFlatList
          data={Object.keys(charactersMap) as (keyof typeof charactersMap)[]}
          keyExtractor={i => i}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={{ gap: 20 }}
          contentContainerStyle={[styles.contentContainer, { alignItems: 'center', backgroundColor: Colors[theme].background }]}
        />
      </CustomBottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    paddingBottom: 20,
    gap: 20,
  },
  canvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 5, // Size of the canvas
    backgroundColor: 'transparent',
  },
  iconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: '50%',
    padding: 4,
    width: 32,
    height: 32,
    overflow: 'hidden',
  },
})
