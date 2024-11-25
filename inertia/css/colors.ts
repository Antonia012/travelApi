export const lightPalette = {
  background: '#faf5ef',
  text: '#5D737E',
  primary: '#7FC6A4',
  secondary: '#5D737E',
  accent: '#F4B886',
  warning: '#91431b',
}

export const darkPalette = {
  background: '#5D737E',
  text: '#FFFFFF',
  primary: '#e1f6e1',
  secondary: '#7FC6A4',
  accent: '#F4B886',
  warning: '#91431b',
}

export type Palette = typeof lightPalette | typeof darkPalette
