/**
 * Converts a numeric value to a hexadecimal string with zero-padding, without 0x prefix.
 *
 * @param options - The options for the conversion.
 * @param options.value - The numeric value to convert to hex (bigint or number).
 * @param options.size - The size in bytes for the resulting hex string (each byte = 2 hex characters).
 * @returns A hexadecimal string prefixed with zeros to match the specified size.
 * @example
 * ```typescript
 * toHexString({ value: 255, size: 2 }) // Returns "00ff"
 * toHexString({ value: 16n, size: 1 }) // Returns "10"
 * ```
 */
export const toHexString = ({
  value,
  size,
}: {
  value: bigint | number;
  size: number;
}): string => {
  return value.toString(16).padStart(size * 2, '0');
};

/**
 * Validates if a string is a properly formatted hex string.
 * @param value - The string to validate.
 * @param options - Optional validation options.
 * @param options.minLength - Minimum length after '0x' prefix (default: 1).
 * @param options.exactLength - Exact length after '0x' prefix (optional).
 * @returns True if the string is a valid hex string, false otherwise.
 */
export function isValidHex(
  value: string,
  options: { minLength?: number; exactLength?: number } = {},
): boolean {
  const { minLength = 1, exactLength } = options;

  if (typeof value !== 'string' || !value.startsWith('0x')) {
    return false;
  }

  const hexContent = value.slice(2); // Remove '0x' prefix

  if (exactLength !== undefined && hexContent.length !== exactLength) {
    return false;
  }

  if (hexContent.length < minLength) {
    return false;
  }

  // Check if all characters are valid hex (0-9, a-f, A-F)
  return /^[0-9a-fA-F]*$/u.test(hexContent);
}
