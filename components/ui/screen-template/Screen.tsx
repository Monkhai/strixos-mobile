import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
  children?: ReactNode
  withRouteHeader?: boolean
}

export default function Screen({ children, withRouteHeader = false }: Props) {
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()
  const paddingTop = withRouteHeader ? headerHeight : insets.top
  return <ThemedView style={{ flex: 1, paddingTop, paddingBottom: insets.bottom }}>{children}</ThemedView>
}

Screen.Header = Header
Screen.Body = Body
Screen.Footer = Footer

function Header({ children }: { children?: ReactNode }) {
  return <View style={{ width: '100%', flex: 1 }}>{children}</View>
}

function Body({ children }: { children?: ReactNode }) {
  return <View style={{ width: '100%', flex: 3 }}>{children}</View>
}
function Footer({ children }: { children?: ReactNode }) {
  return <View style={{ width: '100%', flex: 1 }}>{children}</View>
}
