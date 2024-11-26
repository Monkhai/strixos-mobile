import avatarsMap from '@/assets/characters/avatarsMap'
import AvatarSelector from '@/components/AvatarSelector/AvatarSelector'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { IconSymbol } from '@/components/ui/IconSymbol'
import UIButton from '@/components/ui/UIButton'
import { Colors } from '@/constants/Colors'
import { queryKeyStore } from '@/providers/ReactQueryProvider'
import { Preferences } from '@/storage/preferencesTypes'
import { getPreferences, persistPreferences } from '@/storage/secureStorage'
import { useGlobalStore } from '@/stores/globalStore'
import { PortalProvider } from '@gorhom/portal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SetupView() {
  const insets = useSafeAreaInsets()
  const theme = useColorScheme() ?? 'light'
  const [avatar, setAvatar] = React.useState<keyof typeof avatarsMap>('unknown')
  const [displayName, setDisplayName] = useState('')
  const { setPreferences } = useGlobalStore()
  const queryClient = useQueryClient()

  const { data: preferences } = useQuery({
    queryKey: queryKeyStore.preferences,
    queryFn: async () => await getPreferences(),
  })

  useLayoutEffect(() => {
    if (preferences) {
    }
  }, [preferences])

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ avatar, displayName }: { displayName: string; avatar: keyof typeof avatarsMap }) => {
      // update the cache
      queryClient.setQueryData<Preferences>(queryKeyStore.preferences, { displayName, preferedAvatar: avatar })
      // Set the preferences in the global store (zustand)
      setPreferences({ displayName, preferedAvatar: avatar })
      // Persist the preferences to the secure store
      await persistPreferences({ displayName, preferedAvatar: avatar })
    },
    onSuccess() {
      router.replace('/')
    },
  })

  function handlePressOutside() {
    Keyboard.dismiss()
  }

  function handleContinue() {
    if (isPending) return
    mutate({ avatar, displayName })
  }

  return (
    <PortalProvider>
      <Pressable style={{ flex: 1 }} onPress={handlePressOutside}>
        <ThemedView style={{ flex: 1, paddingTop: insets.top + 40, justifyContent: 'flex-start', alignItems: 'center' }}>
          <ThemedText type="title">Let's set you up</ThemedText>
          <View style={styles.formContainer}>
            <View style={styles.displayNameSection}>
              <ThemedText type="subtitle">Display name</ThemedText>
              <View style={[styles.inputContainer, { backgroundColor: Colors[theme].inputBackground }]}>
                <TextInput
                  onEndEditing={e => {
                    setDisplayName(e.nativeEvent.text)
                  }}
                  placeholderTextColor={Colors[theme].inputPlaceholder}
                  placeholder="What do you want to be called?"
                  style={{ color: Colors[theme].text, width: '100%' }}
                />
              </View>
            </View>

            <View style={styles.avatarSection}>
              <ThemedText type="subtitle">Choose your avatar</ThemedText>
              <AvatarSelector avatar={avatar} onAvatarSelect={a => setAvatar(a)} />
            </View>
          </View>
          <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
            <UIButton
              suffix={<IconSymbol name="arrow.right" size={24} color="white" />}
              wide
              isLoading={isPending}
              disabled={!displayName}
              type="primary"
              onPress={handleContinue}
            >
              <Text style={{ color: 'white' }}>{isPending ? 'Loading...' : 'Continue'}</Text>
            </UIButton>
          </View>
        </ThemedView>
      </Pressable>
    </PortalProvider>
  )
}

const styles = StyleSheet.create({
  formContainer: { gap: 40, paddingTop: 60, alignItems: 'flex-start' },
  avatarSection: { alignItems: 'flex-start', gap: 20 },
  displayNameSection: { alignItems: 'flex-start', gap: 20 },
  inputContainer: {
    width: 250,
    borderRadius: 8,
    paddingHorizontal: Platform.select({
      android: 8,
      ios: 12,
    }),
    paddingVertical: Platform.select({
      android: 0,
      ios: 12,
    }),
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
})
