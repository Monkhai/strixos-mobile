/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'
const tintColorDark = '#fff'

export const PrimaryColors = {
  light: {
    x: {
      primary: '#3973FF',
      secondary: '#89DFCF',
      shadow: '#3973FF20',
    },
    o: {
      primary: '#F66E28',
      secondary: '#F1DE74',
      shadow: '#F66E2820',
    },
    '-': {
      primary: '#00000020',
      secondary: 'transparent',
      shadow: 'transparent',
    },
  },
  dark: {
    x: {
      primary: '#3973FF',
      secondary: '#89DFCF',
      shadow: '#3973FF20',
    },
    o: {
      primary: '#F66E28',
      secondary: '#F1DE74',
      shadow: '#F66E2820',
    },
    '-': {
      primary: '#ffffff20',
      secondary: 'transparent',
      shadow: 'transparent',
    },
  },
}

export const Colors = {
  light: {
    extraDarkPrimary: '#0A84FF',
    darkPrimary: '#0A84FF',
    primary: '#007AFF',
    lightPrimary: '#0A84FF',
    extraLightPrimary: '#E1F0FF',
    danger: '#FF3B30',
    lightDanger: '#FF453A',
    extraLightDanger: '#FF453A',
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
}
