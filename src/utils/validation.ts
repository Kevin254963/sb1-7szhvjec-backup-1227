import type { ProductFormData } from '../types/product';
import { validateDimensions } from './dimensions';

export function validatePhoneFormat(phone: string): string | null {
  if (!phone) return 'Phone number is required';
  
  const phoneRegex = /^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/;
  if (!phoneRegex.test(phone)) {
    return 'Phone number must be in format (XXX)XXX-XXXX';
  }
  
  return null;
}

export function validateZipCode(zipCode: string): string | null {
  if (!zipCode) return 'ZIP code is required';
  if (!/^\d{5}$/.test(zipCode)) {
    return 'ZIP code must be 5 digits';
  }
  return null;
}

export function validateHsCode(hsCode: string): string | null {
  if (!hsCode) return 'HS code is required';
  if (!/^\d{4}\.\d{2}$/.test(hsCode)) {
    return 'HS code must be in format XXXX.XX';
  }
  return null;
}

export function validateProduct(data: ProductFormData): string | null {
  if (!data.name.trim()) return 'Product name is required';
  if (!data.description.trim()) return 'Description is required';
  
  const dimensionsError = validateDimensions(data.length, data.width, data.height);
  if (dimensionsError) return dimensionsError;
  
  const hsCodeError = validateHsCode(data.hsCode);
  if (hsCodeError) return hsCodeError;

  const price = parseFloat(data.price);
  if (isNaN(price) || price <= 0) {
    return 'Price must be greater than 0';
  }

  const stock = parseInt(data.stock);
  if (isNaN(stock) || stock < 0) {
    return 'Stock cannot be negative';
  }

  return null;
}