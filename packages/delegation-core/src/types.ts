import type { BytesLike } from '@metamask/utils';

export type { Hex } from '@metamask/utils';

/**
 * Represents a caveat that restricts or conditions a delegation.
 *
 * @property enforcer - The address of the contract that enforces this caveat's conditions.
 * @property terms - The terms or conditions of the caveat encoded as hex data.
 * @property args - Additional arguments required by the caveat enforcer, encoded as hex data.
 */
export type Caveat<TBytes extends BytesLike = BytesLike> = {
  enforcer: TBytes;
  terms: TBytes;
  args: TBytes;
};

/**
 * Represents a delegation that grants permissions from a delegator to a delegate.
 *
 * @property delegate - The address of the entity receiving the delegation.
 * @property delegator - The address of the entity granting the delegation.
 * @property authority - The authority under which this delegation is granted. For root delegations, this is ROOT_AUTHORITY.
 * @property caveats - An array of restrictions or conditions applied to this delegation.
 * @property salt - A unique value to prevent replay attacks and ensure uniqueness of the delegation.
 * @property signature - The cryptographic signature validating this delegation.
 */
export type Delegation<TBytes extends BytesLike = BytesLike> = {
  delegate: TBytes;
  delegator: TBytes;
  authority: TBytes;
  caveats: Caveat<TBytes>[];
  salt: bigint;
  signature: TBytes;
};
