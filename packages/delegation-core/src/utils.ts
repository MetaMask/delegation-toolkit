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
