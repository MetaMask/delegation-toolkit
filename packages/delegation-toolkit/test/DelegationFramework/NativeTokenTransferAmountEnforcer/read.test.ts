import { createPublicClient, http, type Address, type Hex } from 'viem';
import { sepolia } from 'viem/chains';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as NativeTokenTransferAmountEnforcer from '../../../src/DelegationFramework/NativeTokenTransferAmountEnforcer';
import { randomAddress, randomBytes } from '../../utils';

// Helper function to generate random bytes32
const randomBytes32 = (): Hex => randomBytes(32);

// Mock the readContract function
vi.mock('viem/actions', () => ({
  readContract: vi.fn(),
}));

describe('NativeTokenTransferAmountEnforcer read functions', () => {
  let client: any;
  let contractAddress: Address;
  let delegationManager: Address;
  let delegationHash: Hex;
  let terms: Hex;

  beforeEach(() => {
    client = createPublicClient({
      chain: sepolia,
      transport: http(),
    });
    contractAddress = randomAddress();
    delegationManager = randomAddress();
    delegationHash = randomBytes32();
    terms = randomBytes32();
    vi.clearAllMocks();
  });

  describe('getTermsInfo', () => {
    it('should call readContract with correct parameters and return allowance', async () => {
      const { readContract } = await import('viem/actions');
      const mockAllowance = 1000000000000000000n; // 1 ETH in wei

      (readContract as any).mockResolvedValue(mockAllowance);

      const result = await NativeTokenTransferAmountEnforcer.read.getTermsInfo({
        client,
        contractAddress,
        terms,
      });

      expect(readContract).toHaveBeenCalledWith(client, {
        address: contractAddress,
        abi: expect.any(Array),
        functionName: 'getTermsInfo',
        args: [terms],
      });

      expect(result).toBe(mockAllowance);
    });

    it('should handle different allowance amounts', async () => {
      const { readContract } = await import('viem/actions');
      const testCases = [
        0n, // Zero allowance
        500000000000000000n, // 0.5 ETH
        5000000000000000000n, // 5 ETH
        10000000000000000000000n, // 10,000 ETH
      ];

      for (const allowance of testCases) {
        (readContract as any).mockResolvedValue(allowance);

        const result =
          await NativeTokenTransferAmountEnforcer.read.getTermsInfo({
            client,
            contractAddress,
            terms,
          });

        expect(result).toBe(allowance);
      }
    });

    it('should propagate readContract errors', async () => {
      const { readContract } = await import('viem/actions');
      const mockError = new Error('Contract call failed');

      (readContract as any).mockRejectedValue(mockError);

      await expect(
        NativeTokenTransferAmountEnforcer.read.getTermsInfo({
          client,
          contractAddress,
          terms,
        }),
      ).rejects.toThrow('Contract call failed');
    });
  });

  describe('getSpentAmount', () => {
    it('should call readContract with correct parameters and return spent amount', async () => {
      const { readContract } = await import('viem/actions');
      const mockSpentAmount = 500000000000000000n; // 0.5 ETH in wei

      (readContract as any).mockResolvedValue(mockSpentAmount);

      const result =
        await NativeTokenTransferAmountEnforcer.read.getSpentAmount({
          client,
          contractAddress,
          delegationManager,
          delegationHash,
        });

      expect(readContract).toHaveBeenCalledWith(client, {
        address: contractAddress,
        abi: expect.any(Array),
        functionName: 'spentMap',
        args: [delegationManager, delegationHash],
      });

      expect(result).toBe(mockSpentAmount);
    });

    it('should handle different spent amounts', async () => {
      const { readContract } = await import('viem/actions');
      const testCases = [
        0n, // No spending yet
        100000000000000000n, // 0.1 ETH
        1000000000000000000n, // 1 ETH
        2500000000000000000n, // 2.5 ETH
      ];

      for (const spentAmount of testCases) {
        (readContract as any).mockResolvedValue(spentAmount);

        const result =
          await NativeTokenTransferAmountEnforcer.read.getSpentAmount({
            client,
            contractAddress,
            delegationManager,
            delegationHash,
          });

        expect(result).toBe(spentAmount);
      }
    });

    it('should work with different delegation hashes and managers', async () => {
      const { readContract } = await import('viem/actions');
      const mockSpentAmount = 750000000000000000n; // 0.75 ETH

      (readContract as any).mockResolvedValue(mockSpentAmount);

      const alternativeDelegationManager = randomAddress();
      const alternativeDelegationHash = randomBytes32();

      const result =
        await NativeTokenTransferAmountEnforcer.read.getSpentAmount({
          client,
          contractAddress,
          delegationManager: alternativeDelegationManager,
          delegationHash: alternativeDelegationHash,
        });

      expect(readContract).toHaveBeenCalledWith(client, {
        address: contractAddress,
        abi: expect.any(Array),
        functionName: 'spentMap',
        args: [alternativeDelegationManager, alternativeDelegationHash],
      });

      expect(result).toBe(mockSpentAmount);
    });

    it('should propagate readContract errors', async () => {
      const { readContract } = await import('viem/actions');
      const mockError = new Error('Network error');

      (readContract as any).mockRejectedValue(mockError);

      await expect(
        NativeTokenTransferAmountEnforcer.read.getSpentAmount({
          client,
          contractAddress,
          delegationManager,
          delegationHash,
        }),
      ).rejects.toThrow('Network error');
    });
  });
});
