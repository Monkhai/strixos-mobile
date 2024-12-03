import CustomHeader from '@/components/ui/CustomHeader'
import SettingsView from '@/Views/SettingsView/SettingsView'
import React from 'react'

export default function settings() {
  return (
    <>
      <CustomHeader hideRight title="Settings" />
      <SettingsView />
    </>
  )
}
