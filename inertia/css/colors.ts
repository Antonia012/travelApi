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
  background: '#f9faf9',
  text: '#0d130c',
  primary: '#77a172',
  secondary: '#acc5c8',
  accent: '#8e9eb4',
  warning: '#9A031E',
};

export const darkPalette = {
  background: '#050605',
  text: '#edf3ec',
  primary: '#638d5e',
  secondary: '#375053',
  accent: '#4b5b71',
  warning: '#9A031E',
};

//another one
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

export type Palette = typeof lightPalette | typeof darkPalette;
