import type { PublicClient } from 'viem';
import { createPublicClient, http } from 'viem';
import { readContract } from 'viem/actions';
import { foundry } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { isValidImplementation } from '../../src/actions/isValidImplementation';
import { Implementation } from '../../src/constants';

// Mock the readContract function from viem
vi.mock('viem/actions', () => ({
  readContract: vi.fn(),
}));
const mockReadContract = vi.mocked(readContract);

describe('isValidImplementation', () => {
  let publicClient: PublicClient;

  beforeEach(() => {
    publicClient = createPublicClient({
      chain: foundry,
      transport: http(),
    });

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should return true when NAME() returns "EIP7702StatelessDeleGator" for Stateless7702 implementation', async () => {
      const testAddress = '0x1234567890123456789012345678901234567890';
      mockReadContract.mockResolvedValue('EIP7702StatelessDeleGator');

      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Stateless7702,
      });

      expect(result).toBe(true);
      expect(mockReadContract).toHaveBeenCalledWith(publicClient, {
        address: testAddress,
        abi: expect.arrayContaining([
          expect.objectContaining({
            type: 'function',
            name: 'NAME',
            inputs: [],
            outputs: [{ type: 'string' }],
          }),
        ]),
        functionName: 'NAME',
      });
    });

    it('should return true when NAME() returns "HybridDeleGator" for Hybrid implementation', async () => {
      const testAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
      mockReadContract.mockResolvedValue('HybridDeleGator');

      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Hybrid,
      });

      expect(result).toBe(true);
    });

    it('should return true when NAME() returns "MultiSigDeleGator" for MultiSig implementation', async () => {
      const testAddress = '0x1111111111111111111111111111111111111111';
      mockReadContract.mockResolvedValue('MultiSigDeleGator');

      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.MultiSig,
      });

      expect(result).toBe(true);
    });
  });

  describe('Failure Cases', () => {
    it('should return false when contract call throws an error (no code)', async () => {
      const testAddress = '0x2222222222222222222222222222222222222222';
      mockReadContract.mockRejectedValue(new Error('No code at address'));

      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Stateless7702,
      });

      expect(result).toBe(false);
    });

    it('should return false when contract call throws an error (function not found)', async () => {
      const testAddress = '0x3333333333333333333333333333333333333333';
      mockReadContract.mockRejectedValue(
        new Error('Function NAME() not found'),
      );

      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Hybrid,
      });

      expect(result).toBe(false);
    });

    it('should return false when NAME() returns wrong implementation name', async () => {
      const testAddress = '0x4444444444444444444444444444444444444444';
      // Return the wrong name for Stateless7702
      mockReadContract.mockResolvedValue('HybridDeleGator');

      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Stateless7702,
      });

      expect(result).toBe(false);
    });

    it('should return false when NAME() returns empty string', async () => {
      const testAddress = '0x5555555555555555555555555555555555555555';
      mockReadContract.mockResolvedValue('');

      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.MultiSig,
      });

      expect(result).toBe(false);
    });

    it('should return false when NAME() returns unexpected string', async () => {
      const testAddress = '0x6666666666666666666666666666666666666666';
      mockReadContract.mockResolvedValue('SomeRandomContract');

      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Hybrid,
      });

      expect(result).toBe(false);
    });

    it('should return false when NAME() returns null or undefined', async () => {
      const testAddress = '0x7777777777777777777777777777777777777777';
      mockReadContract.mockResolvedValue(null);

      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Stateless7702,
      });

      expect(result).toBe(false);
    });
  });

  describe('Cross-Implementation Tests', () => {
    it('should correctly validate all implementation types with their expected names', async () => {
      const testAddress = '0x8888888888888888888888888888888888888888';
      const implementationTests = [
        {
          impl: Implementation.Stateless7702,
          expectedName: 'EIP7702StatelessDeleGator',
        },
        { impl: Implementation.Hybrid, expectedName: 'HybridDeleGator' },
        { impl: Implementation.MultiSig, expectedName: 'MultiSigDeleGator' },
      ];

      for (const { impl, expectedName } of implementationTests) {
        mockReadContract.mockResolvedValue(expectedName);

        const result = await isValidImplementation({
          client: publicClient,
          accountAddress: testAddress,
          implementation: impl,
        });

        expect(result).toBe(true);
      }
    });

    it('should reject when implementation names are swapped', async () => {
      const testAddress = '0x9999999999999999999999999999999999999999';

      // Test Stateless7702 with Hybrid name - should fail
      mockReadContract.mockResolvedValue('HybridDeleGator');
      let result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Stateless7702,
      });
      expect(result).toBe(false);

      // Test Hybrid with MultiSig name - should fail
      mockReadContract.mockResolvedValue('MultiSigDeleGator');
      result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Hybrid,
      });
      expect(result).toBe(false);

      // Test MultiSig with Stateless7702 name - should fail
      mockReadContract.mockResolvedValue('EIP7702StatelessDeleGator');
      result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.MultiSig,
      });
      expect(result).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle case sensitivity correctly', async () => {
      const testAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

      // Test with wrong case - should fail
      mockReadContract.mockResolvedValue('eip7702statelessdelegator');
      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Stateless7702,
      });

      expect(result).toBe(false);
    });

    it('should handle extra whitespace in NAME() result', async () => {
      const testAddress = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

      // Test with extra whitespace - should fail (exact match required)
      mockReadContract.mockResolvedValue(' EIP7702StatelessDeleGator ');
      const result = await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Stateless7702,
      });

      expect(result).toBe(false);
    });

    it('should verify the correct ABI is used in contract call', async () => {
      const testAddress = '0xcccccccccccccccccccccccccccccccccccccccc';
      mockReadContract.mockResolvedValue('HybridDeleGator');

      await isValidImplementation({
        client: publicClient,
        accountAddress: testAddress,
        implementation: Implementation.Hybrid,
      });

      expect(mockReadContract).toHaveBeenCalledWith(publicClient, {
        address: testAddress,
        abi: [
          {
            type: 'function',
            name: 'NAME',
            inputs: [],
            outputs: [{ type: 'string' }],
            stateMutability: 'view',
          },
        ],
        functionName: 'NAME',
      });
    });
  });
});
