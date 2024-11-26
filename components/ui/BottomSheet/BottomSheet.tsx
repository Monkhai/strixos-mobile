import { View, Text, useColorScheme, StyleSheet } from 'react-native';
import React from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetHandleProps, BottomSheetProps, WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import { Colors } from '@/constants/Colors';
import { Portal } from '@gorhom/portal';

interface Props extends BottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
}
export default function CustomBottomSheet({ bottomSheetRef, ...props }: Props) {
  const theme = useColorScheme() ?? 'light';
  return (
    <Portal>
      <BottomSheet
        index={-1}
        enableContentPanningGesture={false}
        handleComponent={props => <Handle {...props} />}
        enablePanDownToClose
        backdropComponent={p => <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} />}
        ref={bottomSheetRef}
        enableDynamicSizing={false}
        handleStyle={{ backgroundColor: Colors[theme].background }}
        backgroundStyle={{ backgroundColor: Colors[theme].background }}
        {...props}
      />
    </Portal>
  );
}

function Handle(props: BottomSheetHandleProps) {
  const theme = useColorScheme() ?? 'light';
  return (
    <View
      {...props}
      style={{
        backgroundColor: 'transparent',
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
      }}
    >
      <Canvas style={styles.canvas}>
        <RoundedRect r={10} x={0} y={0} width={36} height={5} color={themedIndicatorColor[theme].light} opacity={0.5} />
        <RoundedRect r={10} x={0} y={0} width={35} height={5} color="#7F7F7F" opacity={0.4} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 5,
    backgroundColor: 'transparent',
  },
});

const themedIndicatorColor = {
  light: {
    light: '#3D3D3D',
    dark: '#7f7f7f',
  },
  dark: {
    light: '#c2c2c2',
    dark: '#7f7f7f',
  },
};
