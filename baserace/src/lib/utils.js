export const decimalToBinary = (dec) => (dec >>> 0).toString(2);

export const decimalToHex = (dec) => dec.toString(16).toUpperCase();

export const binaryToDecimal = (bin) => parseInt(bin, 2);

export const hexToDecimal = (hex) => parseInt(hex, 16);

export const getRandomNumber = (max) => Math.floor(Math.random() * max);

export const getRandomFormat = () => {
  const formats = ['decimal', 'binary', 'hex'];
  return formats[Math.floor(Math.random() * formats.length)];
};
