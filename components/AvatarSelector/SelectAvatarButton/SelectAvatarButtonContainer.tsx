import charactersMap from '@/assets/characters/avatarsMap';
import React from 'react';
import SelectAvatarButton from './SelectAvatarButton';

interface Props {
  avatar: keyof typeof charactersMap;
  onAvatarSelect: (avatar: keyof typeof charactersMap) => void;
}
export default function SelectAvatarButtonContainer({ avatar, onAvatarSelect }: Props) {
  function handleSelectAvatar() {
    onAvatarSelect(avatar);
  }

  return <SelectAvatarButton onSelect={handleSelectAvatar} avatar={avatar} />;
}
