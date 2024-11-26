import charactersMap from '@/assets/characters/avatarsMap';

export interface InitialIdentity {
  id: string;
  secret: string;
}

export interface Identity {
  id: string;
  secret: string;
  avatar: keyof typeof charactersMap;
  displayName: string;
}

export interface SafeIdentity {
  id: string;
  identity: keyof typeof charactersMap;
  displayName: string;
}
