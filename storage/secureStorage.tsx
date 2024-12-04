import { Identity } from '@/server/playerTypes'
import * as SecureStore from 'expo-secure-store'
import { Preferences } from './preferencesTypes'

const IDENTITY_KEY = 'identity'
const PREFERENCES_KEY = 'preferences'

export async function setIdentity(identity: Identity) {
  console.log('setting new identity')
  const preferences = await getPreferences()
  if (preferences && preferences.preferedAvatar) {
    const newIdentity: Identity = { ...identity, avatar: preferences.preferedAvatar }
    await SecureStore.setItemAsync(IDENTITY_KEY, JSON.stringify(newIdentity))
    return
  }
  await SecureStore.setItemAsync(IDENTITY_KEY, JSON.stringify(identity))
}

export async function getIdentity(): Promise<Identity | null> {
  const identity = await SecureStore.getItemAsync(IDENTITY_KEY)
  if (identity) {
    try {
      const parsedIdentity = JSON.parse(identity)
      return parsedIdentity
    } catch (error) {
      console.error('error parsing identity', error)
      return null
    }
  } else {
    return null
  }
}

export async function persistPreferences(preferences: Preferences) {
  await SecureStore.setItemAsync(PREFERENCES_KEY, JSON.stringify(preferences))
  const identity = await getIdentity()
  if (!identity) {
    return
  }
  const newIdentity: Identity = { ...identity, avatar: preferences.preferedAvatar, displayName: preferences.displayName }
  await setIdentity(newIdentity)
}

export async function getPreferences(): Promise<Preferences | null> {
  const preferences = await SecureStore.getItemAsync(PREFERENCES_KEY)
  if (preferences) {
    try {
      const parsedPreferences = JSON.parse(preferences)
      return parsedPreferences
    } catch (error) {
      console.error('error parsing preferences', error)
      return null
    }
  } else {
    return null
  }
}

export async function cleanPreferences() {
  await SecureStore.deleteItemAsync(PREFERENCES_KEY)
}
