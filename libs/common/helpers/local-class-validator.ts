export function toLowerCaseTransformer(value: string): string {
    return value ? value.toLowerCase() : value; // Handle null or undefined values
  }
  
  export function trimTransformer(value: string): string {
    return value ? value.trim() : value; // Handle null or undefined values
  }
  