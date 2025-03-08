import { Identity } from '@/server/playerTypes'
import * as SecureStore from 'expo-secure-store'
import { Preferences } from './preferencesTypes'

const IDENTITY_KEY = 'identity'
const PREFERENCES_KEY = 'preferences'

export function setIdentity(identity: Identity) {
  const preferences = getPreferences()
  if (preferences && preferences.preferedAvatar) {
    const newIdentity: Identity = { ...identity, avatar: preferences.preferedAvatar }
    SecureStore.setItem(IDENTITY_KEY, JSON.stringify(newIdentity))
    return
  }
  SecureStore.setItem(IDENTITY_KEY, JSON.stringify(identity))
}

export function getIdentity(): Identity | null {
  const identity = SecureStore.getItem(IDENTITY_KEY)
  if (identity) {
    try {
      const parsedIdentity = JSON.parse(identity)
      return parsedIdentity
    } catch (error) {
      return null
    }
  } else {
    return null
  }
}

export function persistPreferences(preferences: Preferences) {
  SecureStore.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
  const identity = getIdentity()
  if (!identity) {
    return
  }
  const newIdentity: Identity = { ...identity, avatar: preferences.preferedAvatar, displayName: preferences.displayName }
  setIdentity(newIdentity)
}

export function getPreferences(): Preferences | null {
  const preferences = SecureStore.getItem(PREFERENCES_KEY)
  if (preferences) {
    try {
      const parsedPreferences = JSON.parse(preferences)
      return parsedPreferences
    } catch (error) {
      return null
    }
  } else {
    return null
  }
}

export function cleanPreferences() {
  SecureStore.deleteItemAsync(PREFERENCES_KEY)
}
