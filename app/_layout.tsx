import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as NavigationBar from 'expo-navigation-bar'
import { router, Stack, usePathname } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import ReactQueryProvider, { queryKeyStore } from '@/providers/ReactQueryProvider'
import { cleanPreferences, getPreferences } from '@/storage/secureStorage'
import { useGlobalStore } from '@/stores/globalStore'
import { useQuery } from '@tanstack/react-query'
import { Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
if (Platform.OS === 'android') {
  NavigationBar.setVisibilityAsync('hidden')
  NavigationBar.setBehaviorAsync('inset-swipe')
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const navBarVisibliity = NavigationBar.useVisibility()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  useEffect(() => {
    if (navBarVisibliity === 'visible') {
      if (Platform.OS === 'android') {
        setTimeout(() => {
          NavigationBar.setVisibilityAsync('hidden')
        }, 2000)
      }
    }
  }, [navBarVisibliity])

  if (!loaded) {
    return null
  }

  return (
    <ReactQueryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Layout />
      </ThemeProvider>
    </ReactQueryProvider>
  )
}

function Layout() {
  const path = usePathname()
  const { setPreferences, preferences: p } = useGlobalStore()
  const { data: preferences } = useQuery({
    queryKey: queryKeyStore.preferences,
    queryFn: async () => {
      const preferences = await getPreferences()
      if (preferences) {
        setPreferences(preferences)
      }
      return preferences
    },
  })

  useEffect(() => {
    if (preferences === null) {
      router.replace('/setup')
    }
  }, [preferences, path])

  if (preferences === undefined) {
    return null
  }

  if (preferences === null) {
    return (
      <>
        <GestureHandlerRootView>
          <Stack initialRouteName="setup">
            <Stack.Screen name="setup" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </>
    )
  }

  // cleanPreferences()

  return (
    <>
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="index" options={{ animationTypeForReplace: 'pop' }} />
          <Stack.Screen name="game" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="settings" options={{ presentation: 'fullScreenModal' }} />
        </Stack>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </>
  )
}
