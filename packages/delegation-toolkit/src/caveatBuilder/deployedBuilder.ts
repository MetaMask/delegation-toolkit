import { concat, isAddress, isHex, pad, type Address, type Hex } from 'viem';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const deployed = 'deployed';

export type DeployedBuilderConfig = {
  contractAddress: Address;
  salt: Hex;
  bytecode: Hex;
};

/**
 * Builds a caveat struct for a DeployedEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration for the deployed builder.
 * @returns The Caveat.
 * @throws Error if the contract address, factory address, or bytecode is invalid.
 */
export const deployedBuilder = (
  environment: DeleGatorEnvironment,
  config: DeployedBuilderConfig,
): Caveat => {
  const { contractAddress, salt, bytecode } = config;

  // we check that the addresses are valid, but don't need to be checksummed
  if (!isAddress(contractAddress, { strict: false })) {
    throw new Error(
      `Invalid contractAddress: must be a valid Ethereum address`,
    );
  }

  if (!isHex(salt)) {
    throw new Error('Invalid salt: must be a valid hexadecimal string');
  }

  if (!isHex(bytecode)) {
    throw new Error('Invalid bytecode: must be a valid hexadecimal string');
  }

  const terms = concat([contractAddress, pad(salt, { size: 32 }), bytecode]);

  const {
    caveatEnforcers: { DeployedEnforcer },
  } = environment;

  if (!DeployedEnforcer) {
    throw new Error('DeployedEnforcer not found in environment');
  }

  return {
    enforcer: DeployedEnforcer,
    terms,
    args: '0x',
  };
};
