import { EIP7702StatelessDeleGator } from '@metamask/delegation-abis';
import type { Client, Address } from 'viem';
import { readContract } from 'viem/actions';

/**
 * Parameters for checking if an EOA is delegated to the EIP7702StatelessDeleGator.
 */
export type IsEip7702StatelessDelegatedAccountParameters = {
  /** The client to use for the query. */
  client: Client;
  /** The address to check for EIP7702 delegation to StatelessDeleGator. */
  accountAddress: Address;
};

/**
 * Checks if an EOA is specifically delegated to the EIP7702StatelessDeleGator implementation.
 *
 * This function goes beyond simply checking if code exists at the address (which could be any contract
 * or any EIP7702 delegation). It specifically verifies that the account is delegated to the
 * EIP7702StatelessDeleGator by calling the NAME() function and ensuring it returns "EIP7702StatelessDeleGator".
 *
 * @param params - The parameters for checking the delegation.
 * @param params.client - The client to use for the query.
 * @param params.accountAddress - The address to check for EIP7702 delegation.
 * @returns A promise that resolves to true if the account is delegated to EIP7702StatelessDeleGator, false otherwise.
 * @example
 * ```typescript
 * const isDelegated = await isEip7702StatelessDelegatedAccount({
 *   client: publicClient,
 *   accountAddress: '0x...',
 * });
 *
 * if (isDelegated) {
 *   console.log('Account is delegated to EIP7702StatelessDeleGator');
 * } else {
 *   console.log('Account is not delegated to EIP7702StatelessDeleGator');
 * }
 * ```
 */
export async function isEip7702StatelessDelegatedAccount({
  client,
  accountAddress,
}: IsEip7702StatelessDelegatedAccountParameters): Promise<boolean> {
  try {
    const contractName = await readContract(client, {
      address: accountAddress,
      abi: EIP7702StatelessDeleGator.abi,
      functionName: 'NAME',
    });

    return contractName === 'EIP7702StatelessDeleGator';
  } catch (error) {
    // If the call fails (e.g., no code at address, or NAME() function doesn't exist),
    // then it's not delegated to our implementation
    return false;
  }
}
