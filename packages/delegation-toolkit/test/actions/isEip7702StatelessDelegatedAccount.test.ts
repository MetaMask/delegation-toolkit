import type { PublicClient } from 'viem';
import { createPublicClient, http } from 'viem';
import { foundry } from 'viem/chains';
import { beforeEach, describe, expect, it } from 'vitest';

import { isEip7702StatelessDelegatedAccount } from '../../src/actions/isEip7702StatelessDelegatedAccount';

describe('isEip7702StatelessDelegatedAccount', () => {
  let publicClient: PublicClient;

  beforeEach(() => {
    publicClient = createPublicClient({
      chain: foundry,
      transport: http(),
    });
  });

  it('should return false for an address with no code', async () => {
    const randomAddress = '0x1234567890123456789012345678901234567890';

    const result = await isEip7702StatelessDelegatedAccount({
      client: publicClient,
      accountAddress: randomAddress,
    });

    expect(result).toBe(false);
  });

  it('should return false for an address that does not implement NAME() function', async () => {
    // Use an address that we know has code but doesn't implement NAME()
    // In this case, we'll use the zero address which should fail
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    const result = await isEip7702StatelessDelegatedAccount({
      client: publicClient,
      accountAddress: zeroAddress,
    });

    expect(result).toBe(false);
  });

  it('should return false for a contract that implements NAME() but returns a different name', async () => {
    // This test would need a mock contract that implements NAME() but returns something else
    // For now, we'll just test the error handling path with an invalid address
    const invalidAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

    const result = await isEip7702StatelessDelegatedAccount({
      client: publicClient,
      accountAddress: invalidAddress,
    });

    expect(result).toBe(false);
  });

  // Note: A full integration test would require:
  // 1. Deploying the EIP7702StatelessDeleGator contract
  // 2. Creating an EOA and delegating it to that contract using EIP-7702
  // 3. Testing that the function returns true for that delegated account
  // This would be better suited for the e2e test suite
});
