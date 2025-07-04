import { encodeAbiParameters, isAddress } from 'viem';

import type { ExecutionStruct } from '../executions';
import type { Caveat, DeleGatorEnvironment } from '../types';

export const exactCalldataBatch = 'exactCalldataBatch';

export type ExactCalldataBatchBuilderConfig = {
  executions: ExecutionStruct[];
};

/**
 * Builds a caveat struct for ExactCalldataBatchEnforcer.
 * This enforcer ensures that the provided batch execution calldata matches exactly
 * the expected calldata for each execution.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing executions.
 * @returns The Caveat.
 * @throws Error if any of the executions have invalid parameters.
 */
export const exactCalldataBatchBuilder = (
  environment: DeleGatorEnvironment,
  config: ExactCalldataBatchBuilderConfig,
): Caveat => {
  const { executions } = config;

  if (executions.length === 0) {
    throw new Error('Invalid executions: array cannot be empty');
  }

  // Validate each execution
  for (const execution of executions) {
    if (!isAddress(execution.target, { strict: false })) {
      throw new Error('Invalid target: must be a valid address');
    }

    if (execution.value < 0n) {
      throw new Error('Invalid value: must be a non-negative number');
    }

    if (!execution.callData.startsWith('0x')) {
      throw new Error(
        'Invalid calldata: must be a hex string starting with 0x',
      );
    }
  }

  // Encode the executions using the approach implemented in ExecutionLib.sol encodeBatch()
  const terms = encodeAbiParameters(
    [
      {
        type: 'tuple[]',
        components: [
          { type: 'address', name: 'target' },
          { type: 'uint256', name: 'value' },
          { type: 'bytes', name: 'callData' },
        ],
      },
    ],
    [executions],
  );

  const {
    caveatEnforcers: { ExactCalldataBatchEnforcer },
  } = environment;

  if (!ExactCalldataBatchEnforcer) {
    throw new Error('ExactCalldataBatchEnforcer not found in environment');
  }

  return {
    enforcer: ExactCalldataBatchEnforcer,
    terms,
    args: '0x',
  };
};
