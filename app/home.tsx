import { View, Text } from 'react-native'
import React from 'react'
import CustomHeader from '@/components/ui/CustomHeader'
import HomeView from '@/Views/HomeView/HomeView'
import Screen from '@/components/ui/screen-template/Screen'

export default function home() {
  return (
    <>
      <CustomHeader hideLeft />
      <Screen withRouteHeader>
        <Screen.Header>
          <Text>Test</Text>
        </Screen.Header>
        <Screen.Body>
          <Text>Test</Text>
        </Screen.Body>
        <Screen.Footer>
          <Text>Test</Text>
        </Screen.Footer>
      </Screen>
      {/* <HomeView /> */}
    </>
  )
}
