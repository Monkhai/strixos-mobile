import CustomHeader from '@/components/ui/CustomHeader'
import HomeView from '@/Views/HomeView/HomeView'
import { Redirect } from 'expo-router'
import React from 'react'

export default function index() {
  return <Redirect withAnchor href={'/home'} />
}
