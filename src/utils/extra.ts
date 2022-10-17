import colors from './colors.json';

export const colorIsSpecial = (str: string): boolean =>
  colors.some((color) => color.hex === str);

export const getName = (color: string): string | void => {
  const match = colors.find(
    (str) => str.hex.toLowerCase() === color.toLowerCase()
  );

  if (match) {
    return match.name.replace(/([A-Z])/g, ' $1').trim();
  }
};
