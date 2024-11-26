import charactersMap from '@/assets/characters/avatarsMap';
import React from 'react';
import { Image } from 'react-native';

interface Props {
  avatar: keyof typeof charactersMap;
  size?: number;
}

export default function Avatar({ avatar, size = 50 }: Props) {
  return <Image source={charactersMap[avatar]} style={{ width: size, height: size, borderRadius: size / 2 }} />;
}
