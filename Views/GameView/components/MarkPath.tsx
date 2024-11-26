import { AnimatedProp, Canvas, Path, PathDef } from '@shopify/react-native-skia';
import React from 'react';
import { SIZE } from './Board/Cell/constants';
import { SMALL_SIZE } from './MarkPathConstant';

interface Props {
  path: AnimatedProp<PathDef>;
  color: string;
}
export default function MarkPath({ color, path }: Props) {
  return (
    <Canvas style={{ width: SMALL_SIZE, height: SMALL_SIZE }}>
      <Path path={path} color={color} style="stroke" strokeWidth={6} />
    </Canvas>
  );
}
