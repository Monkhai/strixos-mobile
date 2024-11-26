import charactersMap from '@/assets/characters/avatarsMap';
import Avatar from '@/components/ui/Avatar';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import React from 'react';
import { GestureResponderEvent, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  avatar: keyof typeof charactersMap;
  onSelect: () => void;
}
export default function SelectAvatarButton({ avatar, onSelect }: Props) {
  const scale = useSharedValue(1);
  const degress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${degress.value}deg` }],
    };
  });

  function handlePressIn() {
    impactAsync(ImpactFeedbackStyle.Light);
    scale.value = withTiming(1.05);
    degress.value = withSequence(withTiming(10), withTiming(-5), withTiming(0));
  }

  function handlePressOut() {
    scale.value = withTiming(1);
    degress.value = withTiming(0);
  }
  return (
    <AnimatedPressable onPress={onSelect} style={animatedStyle} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Avatar size={100} avatar={avatar} />
    </AnimatedPressable>
  );
}
