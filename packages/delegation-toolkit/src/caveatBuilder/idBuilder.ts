import { maxUint256, toHex } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';

export type IdBuilderConfig = {
  idValue: bigint | number;
};

export const id = 'id';

/**
 * Builds a caveat struct for the IdEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object containing the id to use in the caveat.
 * @returns The Caveat.
 * @throws Error if the provided id is not a number, not an integer, or is not 32 bytes or fewer in length.
 */
export const idBuilder = (
  environment: DeleGatorEnvironment,
  config: IdBuilderConfig,
): Caveat => {
  const { idValue } = config;

  let idValueBigInt: bigint;

  if (typeof idValue === 'number') {
    if (!Number.isInteger(idValue)) {
      throw new Error('Invalid id: must be an integer');
    }

    idValueBigInt = BigInt(idValue);
  } else if (typeof idValue === 'bigint') {
    idValueBigInt = idValue;
  } else {
    throw new Error('Invalid id: must be a bigint or number');
  }

  if (idValueBigInt < 0n) {
    throw new Error('Invalid id: must be a non-negative number');
  }

  if (idValueBigInt > maxUint256) {
    throw new Error('Invalid id: must be less than 2^256');
  }

  const terms = toHex(idValueBigInt, { size: 32 });

  const {
    caveatEnforcers: { IdEnforcer },
  } = environment;

  if (!IdEnforcer) {
    throw new Error('IdEnforcer not found in environment');
  }

  return {
    enforcer: IdEnforcer,
    terms,
    args: '0x',
  };
};
