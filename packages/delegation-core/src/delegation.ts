import { encodeSingle, decodeSingle } from '@metamask/abi-utils';
import { type BytesLike } from '@metamask/utils';

import {
  bytesLikeToBytes,
  bytesLikeToHex,
  defaultOptions,
  prepareResult,
  type EncodingOptions,
  type ResultValue,
} from './returns';
import type { Delegation, Hex } from './types';

/**
 * To be used on a delegation as the root authority.
 */
export const ROOT_AUTHORITY =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

/**
 * The ABI types for an array of delegations.
 */
const DELEGATION_ARRAY_ABI_TYPES =
  '(address,address,bytes32,(address,bytes,bytes)[],uint256,bytes)[]' as const;

/**
 * Encodes an array of delegations into a permission context.
 * @param delegations - The delegations to encode.
 * @param options - Encoding options. Defaults to { out: 'hex' }.
 * @returns The encoded delegations as a hex string (default) or Uint8Array.
 */
export function encodeDelegations(
  delegations: Delegation[],
  options?: EncodingOptions<'hex'>,
): Hex;
export function encodeDelegations(
  delegations: Delegation[],
  options: EncodingOptions<'bytes'>,
): Uint8Array;
/**
 * Encodes an array of delegations into a permission context.
 * @param delegations - The delegations to encode.
 * @param options - Encoding options. Defaults to { out: 'hex' }.
 * @returns The encoded delegations as a hex string (default) or Uint8Array.
 */
export function encodeDelegations(
  delegations: Delegation[],
  options: EncodingOptions<ResultValue> = defaultOptions,
): Hex | Uint8Array {
  let result: Uint8Array;

  if (delegations.length === 0) {
    // short circuit for empty delegations, derived from
    // `encode(['(address,address,bytes32,(address,bytes,bytes)[],uint256,bytes)[]'],[[]],);`
    result = new Uint8Array(64);
    result[31] = 0x20;
  } else {
    const encodableStructs = delegations.map((struct) => [
      struct.delegate,
      struct.delegator,
      struct.authority,
      struct.caveats.map((caveat) => [
        caveat.enforcer,
        caveat.terms,
        caveat.args,
      ]),
      struct.salt,
      struct.signature,
    ]);

    result = encodeSingle(DELEGATION_ARRAY_ABI_TYPES, encodableStructs);
  }

  return prepareResult(result, options);
}

/**
 * Converts a decoded delegation struct to a delegation object using the provided conversion function.
 * @param decodedDelegation - The decoded delegation struct as a tuple.
 * @param convertFn - Function to convert BytesLike values to the desired output type.
 * @returns A delegation object with all bytes-like values converted using the provided function.
 */
const delegationFromDecodedDelegation = <TEncoding extends BytesLike>(
  decodedDelegation: DecodedDelegation,
  convertFn: (value: BytesLike) => TEncoding,
): Delegation<TEncoding> => {
  const [delegate, delegator, authority, caveats, salt, signature] =
    decodedDelegation;

  return {
    delegate: convertFn(delegate),
    delegator: convertFn(delegator),
    authority: convertFn(authority),
    caveats: caveats.map(([enforcer, terms, args]) => ({
      enforcer: convertFn(enforcer),
      terms: convertFn(terms),
      args: convertFn(args),
    })),
    salt,
    signature: convertFn(signature),
  };
};

/**
 * Represents a decoded delegation as a tuple structure.
 * This type defines the structure of a delegation after it has been decoded from
 * an encoded format.
 */
type DecodedDelegation = [
  BytesLike,
  BytesLike,
  BytesLike,
  [BytesLike, BytesLike, BytesLike][],
  bigint,
  BytesLike,
];

/**
 * Decodes an encoded permission context back into an array of delegations.
 * @param encoded - The encoded delegations as a hex string or Uint8Array.
 * @param options - Encoding options. Defaults to { out: 'hex' }.
 * @returns The decoded delegations array with types resolved based on options.
 */
export function decodeDelegations(
  encoded: BytesLike,
  options?: EncodingOptions<'hex'>,
): Delegation<Hex>[];
export function decodeDelegations(
  encoded: BytesLike,
  options: EncodingOptions<'bytes'>,
): Delegation<Uint8Array>[];
/**
 * Decodes an encoded permission context back into an array of delegations.
 * @param encoded - The encoded delegations as a hex string or Uint8Array.
 * @param options - Encoding options. Defaults to { out: 'hex' }.
 * @returns The decoded delegations array with types resolved based on options.
 */
export function decodeDelegations(
  encoded: BytesLike,
  options: EncodingOptions<ResultValue> = defaultOptions,
): Delegation<Hex>[] | Delegation<Uint8Array>[] {
  // it's possible to short circuit for empty delegations, but due to the
  // complexity of the input type, and the relative infrequency of empty delegations,
  // it's not worthwhile.

  const decodedStructs = decodeSingle(
    DELEGATION_ARRAY_ABI_TYPES,
    encoded,
    // return types cannot be inferred from complex ABI types, so we must assert the type
  ) as DecodedDelegation[];

  if (options.out === 'bytes') {
    return decodedStructs.map((struct) =>
      delegationFromDecodedDelegation(struct, bytesLikeToBytes),
    );
  }
  return decodedStructs.map((struct) =>
    delegationFromDecodedDelegation(struct, bytesLikeToHex),
  );
}
