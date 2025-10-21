import type { PublicClient, Hex } from 'viem';
import { createPublicClient, http } from 'viem';
import { getCode } from 'viem/actions';
import { foundry } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { isValid7702Implementation } from '../../src/actions/isValid7702Implementation';
import type { SmartAccountsEnvironment } from '../../src/types';

// Mock the getCode function from viem
vi.mock('viem/actions', () => ({
  getCode: vi.fn(),
}));
const mockGetCode = vi.mocked(getCode);

describe('isValid7702Implementation', () => {
  let publicClient: PublicClient;
  let mockEnvironment: SmartAccountsEnvironment;

  beforeEach(() => {
    publicClient = createPublicClient({
      chain: foundry,
      transport: http(),
    });

    mockEnvironment = {
      DelegationManager: '0x1000000000000000000000000000000000000000',
      EntryPoint: '0x2000000000000000000000000000000000000000',
      SimpleFactory: '0x3000000000000000000000000000000000000000',
      implementations: {
        EIP7702StatelessDeleGatorImpl:
          '0x4000000000000000000000000000000000000000',
        HybridDeleGatorImpl: '0x5000000000000000000000000000000000000000',
        MultiSigDeleGatorImpl: '0x6000000000000000000000000000000000000000',
      },
      caveatEnforcers: {},
    };

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should return true when account has valid EIP-7702 delegation to correct implementation', async () => {
      const testAddress = '0x1234567890123456789012345678901234567890';
      const delegationCode = '0xef01004000000000000000000000000000000000000000';
      mockGetCode.mockResolvedValue(delegationCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(true);
      expect(mockGetCode).toHaveBeenCalledWith(publicClient, {
        address: testAddress,
      });
    });

    it('should return true when delegation code uses different case but matches implementation', async () => {
      const testAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
      const delegationCode = '0xef0100abcdef1234567890abcdef1234567890abcdef00';
      mockGetCode.mockResolvedValue(delegationCode);

      // Update environment with uppercase address to test case insensitivity
      mockEnvironment.implementations.EIP7702StatelessDeleGatorImpl =
        '0xABCDEF1234567890ABCDEF1234567890ABCDEF00';

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(true);
    });

    it('should return true when delegation prefix uses different case (case-insensitive prefix)', async () => {
      const testAddress = '0xdddddddddddddddddddddddddddddddddddddddd';
      // Use uppercase delegation prefix - this should now pass because we handle case-insensitivity
      const delegationCode = '0xEF01004000000000000000000000000000000000000000';
      mockGetCode.mockResolvedValue(delegationCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(true);
    });

    it('should return true when delegation prefix uses mixed case', async () => {
      const testAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      // Use mixed case delegation prefix to test case-insensitivity thoroughly
      const delegationCode = '0xEf01004000000000000000000000000000000000000000';
      mockGetCode.mockResolvedValue(delegationCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(true);
    });
  });

  describe('Failure Cases', () => {
    it('should return false when getCode throws an error (no code)', async () => {
      const testAddress = '0x2222222222222222222222222222222222222222';
      mockGetCode.mockRejectedValue(new Error('No code at address'));

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should return false when account has no code', async () => {
      const testAddress = '0x3333333333333333333333333333333333333333';
      mockGetCode.mockResolvedValue(undefined);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should return false when code does not start with EIP-7702 prefix', async () => {
      const testAddress = '0x4444444444444444444444444444444444444444';
      const regularCode = '0x608060405234801561001057600080fd5b50';
      mockGetCode.mockResolvedValue(regularCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should return false when delegation code has wrong length', async () => {
      const testAddress = '0x5555555555555555555555555555555555555555';
      const shortCode = '0xef0100';
      mockGetCode.mockResolvedValue(shortCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should return false when delegated address does not match environment implementation', async () => {
      const testAddress = '0x6666666666666666666666666666666666666666';
      const delegationCode = '0xef01009999999999999999999999999999999999999999'; // Wrong address
      mockGetCode.mockResolvedValue(delegationCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should return false when environment has no EIP7702StatelessDeleGatorImpl', async () => {
      const testAddress = '0x7777777777777777777777777777777777777777';
      const delegationCode = '0xef01004000000000000000000000000000000000000000';
      mockGetCode.mockResolvedValue(delegationCode);

      // Remove the implementation from environment
      delete mockEnvironment.implementations.EIP7702StatelessDeleGatorImpl;

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should return false when code has correct prefix but wrong total length', async () => {
      const testAddress = '0x8888888888888888888888888888888888888888';
      const malformedCode =
        '0xef010040000000000000000000000000000000000000000000' as Hex; // Too long
      mockGetCode.mockResolvedValue(malformedCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should return false when code is empty string', async () => {
      const testAddress = '0x9999999999999999999999999999999999999999';
      const emptyCode = '' as Hex;
      mockGetCode.mockResolvedValue(emptyCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should return false when code is boundary length 47 chars', async () => {
      const testAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const shortByOneCode =
        '0xef0100400000000000000000000000000000000000000' as Hex; // 47 chars
      mockGetCode.mockResolvedValue(shortByOneCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should return false when code is boundary length 49 chars', async () => {
      const testAddress = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
      const longByOneCode =
        '0xef01004000000000000000000000000000000000000000a' as Hex; // 49 chars
      mockGetCode.mockResolvedValue(longByOneCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle different case addresses correctly', async () => {
      const testAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const delegationCode = '0xef01004000000000000000000000000000000000000000';
      mockGetCode.mockResolvedValue(delegationCode);

      // Environment has uppercase address
      mockEnvironment.implementations.EIP7702StatelessDeleGatorImpl =
        '0x4000000000000000000000000000000000000000';

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(true);
    });

    it('should extract address correctly from delegation code', async () => {
      const testAddress = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
      const targetImpl = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
      const delegationCode = `0xef0100${targetImpl.slice(2)}` as Hex; // Remove 0x prefix
      mockGetCode.mockResolvedValue(delegationCode);

      mockEnvironment.implementations.EIP7702StatelessDeleGatorImpl =
        targetImpl;

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(true);
    });

    it('should verify the correct parameters are passed to getCode', async () => {
      const testAddress = '0xcccccccccccccccccccccccccccccccccccccccc';
      const delegationCode = '0xef01004000000000000000000000000000000000000000';
      mockGetCode.mockResolvedValue(delegationCode);

      await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(mockGetCode).toHaveBeenCalledWith(publicClient, {
        address: testAddress,
      });
    });

    it('should handle network errors gracefully', async () => {
      const testAddress = '0xdddddddddddddddddddddddddddddddddddddddd';
      mockGetCode.mockRejectedValue(new Error('Network error'));

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should handle contract call errors gracefully', async () => {
      const testAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      mockGetCode.mockRejectedValue(new Error('Contract call failed'));

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should call getCode exactly once per invocation', async () => {
      const testAddress = '0xffffffffffffffffffffffffffffffffffffffff';
      const delegationCode = '0xef01004000000000000000000000000000000000000000';
      mockGetCode.mockResolvedValue(delegationCode);

      await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(mockGetCode).toHaveBeenCalledTimes(1);
      expect(mockGetCode).toHaveBeenCalledExactlyOnceWith(publicClient, {
        address: testAddress,
      });
    });
  });

  describe('EIP-7702 Delegation Format', () => {
    it('should correctly parse valid delegation prefix', async () => {
      const testAddress = '0x1111111111111111111111111111111111111111';
      const validPrefix = '0xef0100';
      const targetAddress = '4000000000000000000000000000000000000000';
      const fullCode = (validPrefix + targetAddress) as Hex;
      mockGetCode.mockResolvedValue(fullCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(true);
    });

    it('should reject invalid delegation prefix', async () => {
      const testAddress = '0x2222222222222222222222222222222222222222';
      const invalidPrefix = '0xef0101'; // Wrong prefix
      const targetAddress = '4000000000000000000000000000000000000000';
      const fullCode = (invalidPrefix + targetAddress) as Hex;
      mockGetCode.mockResolvedValue(fullCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(false);
    });

    it('should validate the exact EIP-7702 delegation prefix format', async () => {
      const testAddress = '0x3333333333333333333333333333333333333333';
      // Test with the exact prefix that should be used (0xef0100)
      const correctPrefix = '0xef0100';
      const targetAddress = '4000000000000000000000000000000000000000';
      const fullCode = (correctPrefix + targetAddress) as Hex;
      mockGetCode.mockResolvedValue(fullCode);

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: mockEnvironment,
      });

      expect(result).toBe(true);
    });

    it('should handle extreme case differences in addresses', async () => {
      const testAddress = '0x4444444444444444444444444444444444444444';
      // Use the same base address as the default environment but test case sensitivity
      const baseAddress = '4000000000000000000000000000000000000000';
      const delegationCode = `0xef0100${baseAddress}` as Hex;
      mockGetCode.mockResolvedValue(delegationCode);

      // Create uppercase implementation address - properly typed
      const uppercaseImplementation = `0x${baseAddress.toUpperCase()}` as const;

      // Create a fresh environment with uppercase implementation address
      const caseTestEnvironment = {
        ...mockEnvironment,
        implementations: {
          ...mockEnvironment.implementations,
          EIP7702StatelessDeleGatorImpl: uppercaseImplementation,
        },
      };

      const result = await isValid7702Implementation({
        client: publicClient,
        accountAddress: testAddress,
        environment: caseTestEnvironment,
      });

      expect(result).toBe(true);
    });
  });
});
