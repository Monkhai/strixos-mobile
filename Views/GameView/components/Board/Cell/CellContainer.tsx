import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import React, { useEffect } from 'react';
import Cell from './Cell';
import { Mark, RowMark } from '@/server/gameTypes';
import { usePathInterpolation } from '@shopify/react-native-skia';
import { valueToNumber } from '../utils';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { solidCirclePath, dashedCirclePath, xPath } from './constants';

interface Props {
  value: RowMark;
  onPress: () => void;
  win: boolean;
  lives: number;
  isDisabled: boolean;
}
export default function CellContainer({ lives, onPress, value, win, isDisabled }: Props) {
  const theme = useColorScheme();
  const progress = useSharedValue(valueToNumber[value]);
  const interpolatedPath = usePathInterpolation(progress, [0, 0.5, 1], [solidCirclePath, dashedCirclePath, xPath]);

  useEffect(() => {
    progress.value = withTiming(valueToNumber[value]);
  }, [value]);

  const color = win ? 'blue' : lives === 0 ? 'red' : theme === 'dark' ? 'white' : 'black';
  return <Cell path={interpolatedPath} color={color} onPress={onPress} isDisabled={isDisabled} />;
}

const styles = StyleSheet.create({});
