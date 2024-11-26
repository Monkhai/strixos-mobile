/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    primary: '#007AFF',
    danger: '#FF3B30',
    text: '#11181C',
    background: '#fff',
    transparentBackground: '#ffffff90',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    inputPlaceholder: '#3C3C4360',
    inputBackground: '#76768012',
  },
  dark: {
    primary: '#0A84FF',
    danger: '#FF453A',
    text: '#ECEDEE',
    background: '#151718',
    transparentBackground: '#15171850',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    inputPlaceholder: '#EBEBF560',
    inputBackground: '#76768024',
  },
};
