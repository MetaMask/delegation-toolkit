import {
  encodeDelegations as encodeDelegationsCore,
  decodeDelegations as decodeDelegationsCore,
  hashDelegation,
  ANY_BENEFICIARY,
  DELEGATION_TYPEHASH,
  CAVEAT_TYPEHASH,
  ROOT_AUTHORITY,
} from '@metamask/delegation-core';
import { hashMessage, toBytes, toHex, getAddress } from 'viem';
import type {
  TypedData,
  AbiParameter,
  Address,
  WalletClient,
  Account,
  Chain,
  Transport,
  Hex,
} from 'viem';

import { type Caveats, resolveCaveats } from './caveatBuilder';
import { CAVEAT_ABI_TYPE_COMPONENTS } from './caveats';
import type { Delegation } from './types';

export {
  ANY_BENEFICIARY,
  DELEGATION_TYPEHASH,
  CAVEAT_TYPEHASH,
  ROOT_AUTHORITY,
};

/**
 * The ABI type components of a Delegation.
 */
export const DELEGATION_ABI_TYPE_COMPONENTS = [
  { type: 'address', name: 'delegate' },
  { type: 'address', name: 'delegator' },
  { type: 'bytes32', name: 'authority' },
  { type: 'tuple[]', name: 'caveats', components: CAVEAT_ABI_TYPE_COMPONENTS },
  { type: 'uint256', name: 'salt' },
  { type: 'bytes', name: 'signature' },
];

/**
 * Converts a delegation to a delegation struct.
 * @param delegation - The delegation to convert.
 * @returns The delegation struct.
 */
export const toDelegationStruct = (
  delegation: Delegation,
): DelegationStruct => {
  const caveats = delegation.caveats.map((caveat) => ({
    enforcer: getAddress(caveat.enforcer),
    terms: caveat.terms,
    args: caveat.args,
  }));

  const salt = delegation.salt === '0x' ? 0n : BigInt(delegation.salt);

  return {
    delegate: getAddress(delegation.delegate),
    delegator: getAddress(delegation.delegator),
    authority:
      delegation.authority === undefined
        ? ROOT_AUTHORITY
        : delegation.authority,
    caveats,
    salt,
    signature: delegation.signature,
  };
};

/**
 * Converts a DelegationStruct to a Delegation.
 * The Delegation type is used for off-chain operations and has a hex string salt.
 * @param delegationStruct - The delegation struct to convert
 * @returns The converted delegation with a hex string salt
 */

export const toDelegation = (
  delegationStruct: DelegationStruct,
): Delegation => {
  return {
    ...delegationStruct,
    salt: toHex(delegationStruct.salt),
  };
};

/**
 * Represents a DelegationStruct as defined in the Delegation Framework.
 * This is distinguished from the Delegation type by requiring the salt to be a bigint
 * instead of a Hex string, which is useful for on-chain operations and EIP-712 signing.
 */
export type DelegationStruct = Omit<Delegation, 'salt'> & {
  salt: bigint;
};

/**
 * ABI Encodes an array of delegations.
 * @param delegations - The delegations to encode.
 * @returns The encoded delegations.
 */
export const encodeDelegations = (delegations: Delegation[]): Hex => {
  const delegationStructs = delegations.map(toDelegationStruct);

  return encodeDelegationsCore(delegationStructs);
};

/**
 * Abi encodes permission contexts.
 * @param delegations - The delegation chains to encode.
 * @returns The encoded permission contexts.
 */
export const encodePermissionContexts = (delegations: Delegation[][]) => {
  const encodedDelegations = delegations.map((delegationChain) =>
    encodeDelegations(delegationChain),
  );

  return encodedDelegations;
};

/**
 * Decodes an array of delegations from its ABI-encoded representation.
 * @param encoded - The hex-encoded delegation array to decode.
 * @returns An array of decoded delegations.
 */
export const decodeDelegations = (encoded: Hex): Delegation[] => {
  // decodeDelegationsCore returns DelegationStruct, so we need to map it back to Delegation
  return decodeDelegationsCore(encoded).map(toDelegation);
};

/**
 * Decodes an array of encoded permission contexts into an array of delegation chains.
 * @param encoded - The hex-encoded permission context to decode.
 * @returns An array of decoded delegations.
 */
export const decodePermissionContexts = (encoded: Hex[]): Delegation[][] => {
  const delegationChains = encoded.map(decodeDelegations);

  return delegationChains;
};

/**
 * TypedData to be used when signing a Delegation. Delegation value for `signature` and Caveat values for `args` are omitted as they cannot be known at signing time.
 */
export const SIGNABLE_DELEGATION_TYPED_DATA: TypedData = {
  Caveat: [
    { name: 'enforcer', type: 'address' },
    { name: 'terms', type: 'bytes' },
  ],
  Delegation: [
    { name: 'delegate', type: 'address' },
    { name: 'delegator', type: 'address' },
    { name: 'authority', type: 'bytes32' },
    { name: 'caveats', type: 'Caveat[]' },
    { name: 'salt', type: 'uint256' },
  ],
} as const;

/**
 * The ABI type for a full delegation.
 */
export const DELEGATION_ARRAY_ABI_TYPE: AbiParameter = {
  type: 'tuple[]',
  components: DELEGATION_ABI_TYPE_COMPONENTS,
} as const;

/**
 * Prepares a delegation hash for passkey signing.
 * @param delegationHash - The delegation hash to prepare.
 * @returns The prepared hash for passkey signing.
 */
export const prepDelegationHashForPasskeySign = (delegationHash: Hex) => {
  return hashMessage({
    raw: toBytes(delegationHash),
  });
};

/**
 * Gets a delegation hash offchain.
 * @param input - The delegation to get the hash for.
 * @returns The hash of the delegation parameters.
 */
export const getDelegationHashOffchain = (input: Delegation): Hex => {
  const delegationStruct = toDelegationStruct(input);

  return hashDelegation(delegationStruct);
};

type BaseCreateDelegationOptions = {
  from: Hex;
  caveats: Caveats;
  parentDelegation?: Delegation | Hex;
  salt?: Hex;
};

/**
 * Options for creating a specific delegation
 */
export type CreateDelegationOptions = BaseCreateDelegationOptions & {
  to: Hex;
};

/**
 * Options for creating an open delegation
 */
export type CreateOpenDelegationOptions = BaseCreateDelegationOptions;

/**
 * Resolves the authority for a delegation based on the parent delegation.
 * @param parentDelegation - The parent delegation or its hash.
 * @returns The resolved authority hash.
 */
export const resolveAuthority = (parentDelegation?: Delegation | Hex): Hex => {
  if (!parentDelegation) {
    return ROOT_AUTHORITY;
  }

  if (typeof parentDelegation === 'string') {
    return parentDelegation;
  }

  return getDelegationHashOffchain(parentDelegation);
};

/**
 * Creates a delegation with specific delegate.
 * @param options - The options for creating the delegation.
 * @returns The created delegation data structure.
 */
export const createDelegation = (
  options: CreateDelegationOptions,
): Delegation => {
  return {
    delegate: options.to,
    delegator: options.from,
    authority: resolveAuthority(options.parentDelegation),
    caveats: resolveCaveats(options.caveats),
    salt: options.salt ?? '0x',
    signature: '0x',
  };
};

/**
 * Creates an open delegation that can be redeemed by any delegate.
 * @param options - The options for creating the open delegation.
 * @returns The created delegation data structure.
 */
export const createOpenDelegation = (
  options: CreateOpenDelegationOptions,
): Delegation => {
  return {
    delegate: ANY_BENEFICIARY,
    delegator: options.from,
    authority: resolveAuthority(options.parentDelegation),
    caveats: resolveCaveats(options.caveats),
    salt: options.salt ?? '0x',
    signature: '0x',
  };
};

/**
 * Signs a delegation.
 * @param params - The parameters for signing the delegation.
 * @param params.signer - The wallet client to use for signing.
 * @param params.delegation - The delegation to sign.
 * @param params.delegationManager - The address of the delegation manager contract.
 * @param params.chainId - The chain ID for the signature.
 * @param params.name - The name of the contract.
 * @param params.version - The version of the contract.
 * @returns The signed delegation.
 */
export const signDelegation = async ({
  signer,
  delegation,
  delegationManager,
  chainId,
  name = 'DelegationManager',
  version = '1',
}: {
  signer: WalletClient<Transport, Chain, Account>;
  delegation: Omit<Delegation, 'signature'>;
  delegationManager: Address;
  chainId: number;
  name?: string;
  version?: string;
}) => {
  const delegationStruct = toDelegationStruct({
    ...delegation,
    signature: '0x',
  });

  return signer.signTypedData({
    account: signer.account,
    domain: {
      chainId,
      name,
      version,
      verifyingContract: delegationManager,
    },
    types: SIGNABLE_DELEGATION_TYPED_DATA,
    primaryType: 'Delegation',
    message: delegationStruct,
  });
};
