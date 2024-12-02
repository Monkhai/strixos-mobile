import { View, Text } from 'react-native'
import React from 'react'
import CustomHeader from '@/components/ui/CustomHeader'
import HomeView from '@/Views/HomeView/HomeView'

export default function home() {
  return (
    <>
      <CustomHeader hideLeft />
      <HomeView />
    </>
  )
}
