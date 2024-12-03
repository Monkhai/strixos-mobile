import CustomHeader from '@/components/ui/CustomHeader'
import HomeView from '@/Views/HomeView/HomeView'
import React from 'react'

export default function home() {
  return (
    <>
      <CustomHeader hideLeft />
      <HomeView />
    </>
  )
}
