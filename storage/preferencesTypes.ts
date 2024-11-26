import charactersMap from '@/assets/characters/avatarsMap';

export interface Preferences {
  displayName: string;
  preferedAvatar: keyof typeof charactersMap;
}
