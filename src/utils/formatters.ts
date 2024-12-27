export function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Return empty string if no numbers
  if (numbers.length === 0) return '';
  
  // Format number as (XXX)XXX-XXXX
  if (numbers.length <= 3) {
    return `(${numbers}`;
  }
  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 3)})${numbers.slice(3)}`;
  }
  return `(${numbers.slice(0, 3)})${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
}

export function formatZipCode(value: string): string {
  // Remove all non-numeric characters and limit to 5 digits
  return value.replace(/\D/g, '').slice(0, 5);
}

export function formatDimensionInput(value: string): string {
  // Remove any characters that aren't numbers or decimal points
  const cleaned = value.replace(/[^\d.]/g, '');
  
  // Handle multiple decimal points - keep only the first one
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return `${parts[0]}.${parts[1]}`;
  }
  
  // Limit to 2 decimal places if there's a decimal point
  if (parts.length === 2) {
    return `${parts[0]}.${parts[1].slice(0, 2)}`;
  }
  
  return cleaned;
}