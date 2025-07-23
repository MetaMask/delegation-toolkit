import { type Hex, isHex, toHex } from 'viem';

/**
 * Checks if two hexadecimal strings are equal, ignoring case sensitivity.
 * @param a - The first hexadecimal string.
 * @param b - The second hexadecimal string.
 * @returns True if the hexadecimal strings are equal, false otherwise.
 */
export function isEqualHex(a: Hex, b: Hex): boolean {
  return isHex(a) && a.toLowerCase() === b.toLowerCase();
}

/**
 * Recursively converts all members of an object to hexadecimal format.
 * Handles various data types including functions, null, strings, booleans,
 * bigints, arrays, and objects.
 *
 * @param obj - The object to convert to hexadecimal format.
 * @returns The object with all values converted to hexadecimal format.
 */
export function deepHexlify(obj: any): any {
  if (typeof obj === 'function') {
    return undefined;
  }

  if (
    obj === null ||
    obj === undefined ||
    typeof obj === 'string' ||
    typeof obj === 'boolean'
  ) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return toHex(obj);
  }

  if (obj._isBigNumber !== null || typeof obj !== 'object') {
    return toHex(obj).replace(/^0x0/u, '0x');
  }

  if (Array.isArray(obj)) {
    return obj.map((member) => deepHexlify(member));
  }

  return Object.keys(obj).reduce(
    (set, key) =>
      Object.assign(Object.assign({}, set), {
        [key]: deepHexlify(obj[key]),
      }),
    {},
  );
}
