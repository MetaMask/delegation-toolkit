import { isHexString } from '@metamask/utils';
import type { BytesLike } from '@metamask/utils';

import {
  defaultOptions,
  prepareResult,
  type EncodingOptions,
  type ResultValue,
} from '../returns';
import type { Hex } from '../types';

// char length of 32 byte hex string (including 0x prefix)
const MAX_NONCE_STRING_LENGTH = 66;

/**
 * Terms for configuring a Nonce caveat.
 */
export type NonceTerms = {
  /** The nonce as a hex string to allow bulk revocation of delegations. */
  nonce: BytesLike;
};

/**
 * Creates terms for a Nonce caveat that uses a nonce value for bulk revocation of delegations.
 *
 * @param terms - The terms for the Nonce caveat.
 * @param encodingOptions - The encoding options for the result.
 * @returns The terms as a 32-byte hex string.
 * @throws Error if the nonce is invalid.
 */
export function createNonceTerms(
  terms: NonceTerms,
  encodingOptions?: EncodingOptions<'hex'>,
): Hex;
export function createNonceTerms(
  terms: NonceTerms,
  encodingOptions: EncodingOptions<'bytes'>,
): Uint8Array;
/**
 * Creates terms for a Nonce caveat that uses a nonce value for bulk revocation of delegations.
 *
 * @param terms - The terms for the Nonce caveat.
 * @param encodingOptions - The encoding options for the result.
 * @returns The terms as a 32-byte hex string.
 * @throws Error if the nonce is invalid.
 */
export function createNonceTerms(
  terms: NonceTerms,
  encodingOptions: EncodingOptions<ResultValue> = defaultOptions,
): Hex | Uint8Array {
  const { nonce } = terms;

  if (!nonce || nonce === '0x') {
    throw new Error('Invalid nonce: must be a non-empty hex string');
  }

  if (typeof nonce !== 'string' || !nonce.startsWith('0x')) {
    throw new Error('Invalid nonce: must be a valid hex string');
  }

  if (!isHexString(nonce)) {
    throw new Error('Invalid nonce: must be a valid hex string');
  }

  if (nonce.length > MAX_NONCE_STRING_LENGTH) {
    throw new Error('Invalid nonce: must be 32 bytes or less in length');
  }

  // Remove '0x' prefix for padding, then add it back
  const nonceWithoutPrefix = nonce.slice(2);
  const paddedNonce = nonceWithoutPrefix.padStart(64, '0'); // 64 hex chars = 32 bytes
  const hexValue = `0x${paddedNonce}` as Hex;

  return prepareResult(hexValue, encodingOptions);
}
