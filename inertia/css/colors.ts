/*export const lightPalette = {
  background: '#ffffff',
  text: '#000000',
  primary: '#5F0F40',
  secondary: '#0F4C5C',
  secondary_inverse: '#9A031E',
  primary_inverse:'#FB8B24'
};

export const darkPalette = {
  background: '#000000',
  text: '#CCC3BE',
  primary: '#5F0F40',
  secondary: '#8A8988',
  secondary_inverse: '#9A031E',
  primary_inverse:  '#8A8988',
};
*/
export const lightPalette = {
  background: '#e1f6e1',
  text: '#5D737E',
  primary: '#e1f6e1',
  secondary: '#7FC6A4',
  accent: '#F4B886',
  warning: '#91431b',
}

export const darkPalette = {
  background: '#5D737E',
  text: '#e1f6e1',
  primary: '#e1f6e1',
  secondary: '#7FC6A4',
  accent: '#F4B886',
  warning: '#9A031E',
}

//another one

//#16A7DC blue
//#6cdd8f green
//#ceb8a1 bezova
//#7289ff modra
//#d94d3c cervena
/*
export const lightPalette = {
  background: '#fcfcfc',
  text: '#141013',
  primary: '#907486',
  secondary: '#c0c7b8',
  accent: '#9cb0a1'
    warning: '#9A031E',
};

export const darkPalette = {
  background: '#030303',
  text: '#efebee',
  primary: '#8b6f81',
  secondary: '#404738',
  accent: '#4f6354',
  warning: '#9A031E',

};
*/

export type Palette = typeof lightPalette | typeof darkPalette
