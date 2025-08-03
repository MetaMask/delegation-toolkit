import type { Client, Address } from 'viem';
import { readContract } from 'viem/actions';

import { Implementation } from '../constants';

// Simple ABI for the NAME() function that returns a string and has no inputs
const NAME_ABI = [
  {
    type: 'function',
    name: 'NAME',
    inputs: [],
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
] as const;

/**
 * Parameters for checking if an account is delegated to the correct implementation.
 */
export type IsValidImplementationParameters = {
  /** The client to use for the query. */
  client: Client;
  /** The address to check for proper delegation. */
  accountAddress: Address;
  /** The implementation to validate against. */
  implementation: Implementation;
};

/**
 * Mapping of implementations to their expected NAME() return values.
 */
const IMPLEMENTATION_NAMES = {
  [Implementation.MultiSig]: 'MultiSigDeleGator',
  [Implementation.Hybrid]: 'HybridDeleGator',
  [Implementation.Stateless7702]: 'EIP7702StatelessDeleGator',
} as const;

/**
 * Checks if an account is properly delegated to the specified implementation.
 *
 * This function verifies that the account is delegated to the correct implementation
 * by calling the NAME() function and ensuring it returns the expected name for the
 * given implementation type.
 *
 * @param params - The parameters for checking the delegation.
 * @param params.client - The client to use for the query.
 * @param params.accountAddress - The address to check for proper delegation.
 * @param params.implementation - The implementation type to validate against.
 * @returns A promise that resolves to true if the account is properly delegated, false otherwise.
 * @example
 * ```typescript
 * const isValid = await isValidImplementation({
 *   client: publicClient,
 *   accountAddress: '0x...',
 *   implementation: Implementation.Hybrid,
 * });
 *
 * if (isValid) {
 *   console.log('Account is properly delegated to HybridDeleGator');
 * } else {
 *   console.log('Account is not properly delegated');
 * }
 * ```
 */
export async function isValidImplementation({
  client,
  accountAddress,
  implementation,
}: IsValidImplementationParameters): Promise<boolean> {
  try {
    const contractName = await readContract(client, {
      address: accountAddress,
      abi: NAME_ABI,
      functionName: 'NAME',
    });

    const expectedName = IMPLEMENTATION_NAMES[implementation];
    return contractName === expectedName;
  } catch (error) {
    // If the call fails (e.g., no code at address, or NAME() function doesn't exist),
    // then it's not properly delegated to our implementation
    return false;
  }
}
