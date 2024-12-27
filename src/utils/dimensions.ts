import type { Dimensions } from '../types/product';

export function validateDimensions(length: string, width: string, height: string): string | null {
  const dimensions = [
    { value: length, name: 'Length' },
    { value: width, name: 'Width' },
    { value: height, name: 'Height' }
  ];

  for (const dim of dimensions) {
    if (!dim.value) {
      return `${dim.name} is required`;
    }
    
    const value = parseFloat(dim.value);
    if (isNaN(value)) {
      return `${dim.name} must be a number`;
    }
    if (value <= 0) {
      return `${dim.name} must be greater than 0`;
    }
    if (value > 1000) {
      return `${dim.name} cannot exceed 1000 cm`;
    }
  }

  return null;
}

export function formatDimensions(dimensions: Dimensions): string {
  return `${dimensions.length}cm × ${dimensions.width}cm × ${dimensions.height}cm`;
}

export function parseDimensions(dimensionString: string): Dimensions | null {
  const numbers = dimensionString.match(/\d+(\.\d+)?/g);
  if (!numbers || numbers.length !== 3) return null;

  return {
    length: parseFloat(numbers[0]),
    width: parseFloat(numbers[1]),
    height: parseFloat(numbers[2])
  };
}