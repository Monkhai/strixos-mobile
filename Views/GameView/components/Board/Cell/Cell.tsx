import { Canvas, Path, SkPath } from '@shopify/react-native-skia';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { SIZE } from './constants';

interface Props {
  path: SharedValue<SkPath>;
  color: string;
  onPress: () => void;
  isDisabled: boolean;
}

export default function Cell({ path, color, onPress, isDisabled }: Props) {
  return (
    <View>
      <TouchableOpacity
        disabled={isDisabled}
        onPressIn={() => {
          impactAsync(ImpactFeedbackStyle.Light);
        }}
        onPress={onPress}
      >
        <Canvas style={{ width: SIZE, height: SIZE }}>
          <Path path={path} color={color} style="stroke" strokeWidth={4} />
        </Canvas>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
