import { createValueLteTerms } from '@metamask/delegation-core';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const valueLte = 'valueLte';

export type ValueLteBuilderConfig = {
  maxValue: bigint;
};

/**
 * Builds a caveat struct for ValueLteEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object containing the maximum value allowed for the transaction.
 * @returns The Caveat.
 * @throws Error if any of the parameters are invalid.
 */
export const valueLteBuilder = (
  environment: DeleGatorEnvironment,
  config: ValueLteBuilderConfig,
): Caveat => {
  const { maxValue } = config;

  const terms = createValueLteTerms({ maxValue });

  const {
    caveatEnforcers: { ValueLteEnforcer },
  } = environment;

  if (!ValueLteEnforcer) {
    throw new Error('ValueLteEnforcer not found in environment');
  }

  return {
    enforcer: ValueLteEnforcer,
    terms,
    args: '0x',
  };
};
