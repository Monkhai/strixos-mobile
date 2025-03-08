import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as NavigationBar from 'expo-navigation-bar'
import { router, Stack, usePathname } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { Fragment, useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { useConnectToWebSocket } from '@/hooks/useConnectToWebSocket'
import ReactQueryProvider, { queryKeyStore } from '@/providers/ReactQueryProvider'
import { cleanPreferences, getPreferences } from '@/storage/secureStorage'
import { useGlobalStore } from '@/stores/globalStore'
import { useQuery } from '@tanstack/react-query'
import { I18nManager, Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// Prevent the splash screen from auto-hiding before asset loading is complete.
if (I18nManager.isRTL) {
  I18nManager.allowRTL(false)
  I18nManager.forceRTL(false)
}
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    babek: require('../assets/fonts/BakbakOne-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

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
  useConnectToWebSocket()
  const preferences = getPreferences()

  useEffect(() => {
    if (path === '/setup') {
      return
    }
    if (preferences === null) {
      router.dismissTo('/setup')
    }
  }, [preferences, path])

  if (preferences === undefined) {
    return null
  }

  if (preferences === null) {
    return (
      <Fragment>
        <GestureHandlerRootView>
          <Stack initialRouteName="setup">
            <Stack.Screen name="setup" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </Fragment>
    )
  }

  // cleanPreferences()

  return (
    <Fragment>
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="index" options={{ animationTypeForReplace: 'pop' }} />
          <Stack.Screen name="home" options={{ animationTypeForReplace: 'pop' }} />
          <Stack.Screen name="game" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="single-game" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="settings" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="invite-game" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        </Stack>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </Fragment>
  )
}
