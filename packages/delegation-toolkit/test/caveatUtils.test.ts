import { createPublicClient, http, type Hex } from 'viem';
import { sepolia } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { randomAddress, randomBytes } from './utils';
import {
  CaveatUtils,
  createCaveatUtils,
  getCaveatAvailableAmount,
} from '../src/caveatUtils/index';
import type { DeleGatorEnvironment } from '../src/types';

// Helper function to generate random bytes32
const randomBytes32 = (): Hex => randomBytes(32);

// Test configuration for all caveat enforcers
const ENFORCER_TEST_CASES = [
  {
    name: 'ERC20PeriodTransferEnforcer' as const,
    method: 'getERC20PeriodTransferAvailableAmount' as const,
    mockResult: [100n, true, 1n] as const,
    params: () => ({
      delegationHash: randomBytes32(),
      terms: '0x1234' as Hex,
    }),
  },
  {
    name: 'MultiTokenPeriodEnforcer' as const,
    method: 'getMultiTokenPeriodAvailableAmount' as const,
    mockResult: [200n, false, 2n] as const,
    params: () => ({
      delegationHash: randomBytes32(),
      terms: '0x1234' as Hex,
      args: '0x5678' as Hex,
    }),
  },
  {
    name: 'NativeTokenPeriodTransferEnforcer' as const,
    method: 'getNativeTokenPeriodTransferAvailableAmount' as const,
    mockResult: [300n, true, 3n] as const,
    params: () => ({
      delegationHash: randomBytes32(),
      terms: '0x9abc' as Hex,
    }),
  },
  {
    name: 'ERC20StreamingEnforcer' as const,
    method: 'getERC20StreamingAvailableAmount' as const,
    mockResult: 500n,
    params: () => ({
      delegationHash: randomBytes32(),
    }),
  },
  {
    name: 'NativeTokenStreamingEnforcer' as const,
    method: 'getNativeTokenStreamingAvailableAmount' as const,
    mockResult: 600n,
    params: () => ({
      delegationHash: randomBytes32(),
    }),
  },
];

// Helper function to test method parity between specific and generic methods
const testMethodParity = async (
  testCase: (typeof ENFORCER_TEST_CASES)[0],
  publicClient: any,
  mockEnvironment: any,
) => {
  const utils = createCaveatUtils({
    client: publicClient as any,
    environment: mockEnvironment,
  });

  const readContractSpy = vi
    .spyOn(publicClient, 'readContract')
    .mockResolvedValue(testCase.mockResult);

  const params = testCase.params();

  const specificResult = await (utils as any)[testCase.method](params);
  const genericResult = await utils.getAvailableAmount(testCase.name, params);

  expect(specificResult).toEqual(genericResult);
  expect(readContractSpy).toHaveBeenCalledTimes(2);

  readContractSpy.mockRestore();
};

// Helper function to test internal method calls
const testInternalMethodCalls = async (
  testCase: (typeof ENFORCER_TEST_CASES)[0],
  publicClient: any,
  mockEnvironment: any,
) => {
  const utils = createCaveatUtils({
    client: publicClient as any,
    environment: mockEnvironment,
  });

  const readContractSpy = vi
    .spyOn(publicClient, 'readContract')
    .mockResolvedValue(testCase.mockResult);

  const methodSpy = vi.spyOn(utils, testCase.method);
  const params = testCase.params();

  // Call specific method directly - should be called once
  await (utils as any)[testCase.method](params);
  expect(methodSpy).toHaveBeenCalledTimes(1);

  // Call generic method - should call specific method internally (total 2 calls)
  await utils.getAvailableAmount(testCase.name, params);
  expect(methodSpy).toHaveBeenCalledTimes(2);

  methodSpy.mockRestore();
  readContractSpy.mockRestore();
};

describe('CaveatUtils', () => {
  let publicClient: ReturnType<typeof createPublicClient>;
  let mockEnvironment: DeleGatorEnvironment;

  beforeEach(() => {
    publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });

    mockEnvironment = {
      SimpleFactory: randomAddress(),
      EntryPoint: randomAddress(),
      DelegationManager: randomAddress(),
      implementations: {
        HybridDeleGatorImpl: randomAddress(),
        MultiSigDeleGatorImpl: randomAddress(),
        Stateless7702DeleGatorImpl: randomAddress(),
      },
      caveatEnforcers: {
        ERC20PeriodTransferEnforcer: randomAddress(),
        MultiTokenPeriodEnforcer: randomAddress(),
        NativeTokenPeriodTransferEnforcer: randomAddress(),
        ERC20StreamingEnforcer: randomAddress(),
        NativeTokenStreamingEnforcer: randomAddress(),
        // Add other enforcers as needed
      },
    } as DeleGatorEnvironment;
  });

  describe('CaveatUtils class', () => {
    it('should create instance with minimal config', () => {
      const utils = new CaveatUtils({
        client: publicClient as any, // Type assertion to avoid test type issues
        environment: mockEnvironment,
      });

      expect(utils).toBeDefined();
      expect(utils).toBeInstanceOf(CaveatUtils);
    });

    it('should create instance with environment auto-detection', () => {
      const utils = new CaveatUtils({
        client: publicClient as any, // Type assertion to avoid test type issues
        // environment will be auto-detected from chain
      });

      expect(utils).toBeDefined();
      expect(utils).toBeInstanceOf(CaveatUtils);
    });

    it('should throw error if chain ID not found', () => {
      const clientWithoutChain = createPublicClient({
        transport: http('https://eth-sepolia.g.alchemy.com/v2/test'),
        // No chain specified, so chain will be undefined
      });

      expect(() => {
        new CaveatUtils({
          client: clientWithoutChain as any,
        });
      }).toThrow('Chain ID not found in client');
    });
  });

  describe('ERC20PeriodTransferEnforcer', () => {
    it('should call getAvailableAmount with correct parameters', async () => {
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      const mockResult = [100n, true, 1n] as const;
      const readContractSpy = vi
        .spyOn(publicClient, 'readContract')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
      };

      const result = await utils.getERC20PeriodTransferAvailableAmount(params);

      expect(readContractSpy).toHaveBeenCalledWith({
        address: mockEnvironment.caveatEnforcers.ERC20PeriodTransferEnforcer,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [
          params.delegationHash,
          mockEnvironment.DelegationManager,
          params.terms,
        ],
      });

      expect(result).toEqual({
        availableAmount: 100n,
        isNewPeriod: true,
        currentPeriod: 1n,
      });
    });

    it('should use custom delegation manager when provided', async () => {
      const customDelegationManager = randomAddress();
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      const mockResult = [100n, true, 1n] as const;
      const readContractSpy = vi
        .spyOn(publicClient, 'readContract')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
        delegationManager: customDelegationManager,
      };

      await utils.getERC20PeriodTransferAvailableAmount(params);

      expect(readContractSpy).toHaveBeenCalledWith({
        address: mockEnvironment.caveatEnforcers.ERC20PeriodTransferEnforcer,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [params.delegationHash, customDelegationManager, params.terms],
      });
    });

    it('should use custom enforcer address when provided', async () => {
      const customEnforcerAddress = randomAddress();
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      const mockResult = [100n, true, 1n] as const;
      const readContractSpy = vi
        .spyOn(publicClient, 'readContract')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
        enforcerAddress: customEnforcerAddress,
      };

      await utils.getERC20PeriodTransferAvailableAmount(params);

      expect(readContractSpy).toHaveBeenCalledWith({
        address: customEnforcerAddress,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [
          params.delegationHash,
          mockEnvironment.DelegationManager,
          params.terms,
        ],
      });
    });
  });

  describe('MultiTokenPeriodEnforcer', () => {
    it('should call getAvailableAmount with correct parameters including args', async () => {
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      const mockResult = [200n, false, 2n] as const;
      const readContractSpy = vi
        .spyOn(publicClient, 'readContract')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
        args: '0x5678' as Hex,
      };

      const result = await utils.getMultiTokenPeriodAvailableAmount(params);

      expect(readContractSpy).toHaveBeenCalledWith({
        address: mockEnvironment.caveatEnforcers.MultiTokenPeriodEnforcer,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [
          params.delegationHash,
          mockEnvironment.DelegationManager,
          params.terms,
          params.args,
        ],
      });

      expect(result).toEqual({
        availableAmount: 200n,
        isNewPeriod: false,
        currentPeriod: 2n,
      });
    });
  });

  describe('NativeTokenPeriodTransferEnforcer', () => {
    it('should call getAvailableAmount with correct parameters', async () => {
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      const mockResult = [300n, true, 3n] as const;
      const readContractSpy = vi
        .spyOn(publicClient, 'readContract')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x9abc' as Hex,
      };

      const result =
        await utils.getNativeTokenPeriodTransferAvailableAmount(params);

      expect(readContractSpy).toHaveBeenCalledWith({
        address:
          mockEnvironment.caveatEnforcers.NativeTokenPeriodTransferEnforcer,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [
          params.delegationHash,
          mockEnvironment.DelegationManager,
          params.terms,
        ],
      });

      expect(result).toEqual({
        availableAmount: 300n,
        isNewPeriod: true,
        currentPeriod: 3n,
      });
    });
  });

  describe('ERC20StreamingEnforcer', () => {
    it('should call getAvailableAmount with correct parameters', async () => {
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      const mockResult = 500n;
      const readContractSpy = vi
        .spyOn(publicClient, 'readContract')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
      };

      const result = await utils.getERC20StreamingAvailableAmount(params);

      expect(readContractSpy).toHaveBeenCalledWith({
        address: mockEnvironment.caveatEnforcers.ERC20StreamingEnforcer,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [mockEnvironment.DelegationManager, params.delegationHash],
      });

      expect(result).toEqual({
        availableAmount: 500n,
      });
    });
  });

  describe('NativeTokenStreamingEnforcer', () => {
    it('should call getAvailableAmount with correct parameters', async () => {
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      const mockResult = 600n;
      const readContractSpy = vi
        .spyOn(publicClient, 'readContract')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
      };

      const result = await utils.getNativeTokenStreamingAvailableAmount(params);

      expect(readContractSpy).toHaveBeenCalledWith({
        address: mockEnvironment.caveatEnforcers.NativeTokenStreamingEnforcer,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [mockEnvironment.DelegationManager, params.delegationHash],
      });

      expect(result).toEqual({
        availableAmount: 600n,
      });
    });
  });

  describe('Generic getAvailableAmount', () => {
    it('should route to correct enforcer method', async () => {
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      const mockResult = [100n, true, 1n] as const;
      const readContractSpy = vi
        .spyOn(publicClient, 'readContract')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
      };

      const result = await utils.getAvailableAmount(
        'ERC20PeriodTransferEnforcer',
        params,
      );

      expect(readContractSpy).toHaveBeenCalledWith({
        address: mockEnvironment.caveatEnforcers.ERC20PeriodTransferEnforcer,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [
          params.delegationHash,
          mockEnvironment.DelegationManager,
          params.terms,
        ],
      });

      expect(result).toEqual({
        availableAmount: 100n,
        isNewPeriod: true,
        currentPeriod: 1n,
      });
    });

    it('should throw error for unsupported caveat enforcer', async () => {
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      await expect(
        utils.getAvailableAmount('UnsupportedEnforcer' as any, {} as any),
      ).rejects.toThrow('Unsupported caveat enforcer: UnsupportedEnforcer');
    });
  });

  describe('Factory functions', () => {
    it('should create CaveatUtils with createCaveatUtils', () => {
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      expect(utils).toBeDefined();
      expect(utils).toBeInstanceOf(CaveatUtils);
    });

    it('should work with standalone getCaveatAvailableAmount function', async () => {
      const mockResult = [100n, true, 1n] as const;
      const readContractSpy = vi
        .spyOn(publicClient, 'readContract')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
      };

      const result = await getCaveatAvailableAmount(
        'ERC20PeriodTransferEnforcer',
        params,
        {
          client: publicClient as any,
          environment: mockEnvironment,
        },
      );

      expect(readContractSpy).toHaveBeenCalledWith({
        address: mockEnvironment.caveatEnforcers.ERC20PeriodTransferEnforcer,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [
          params.delegationHash,
          mockEnvironment.DelegationManager,
          params.terms,
        ],
      });

      expect(result).toEqual({
        availableAmount: 100n,
        isNewPeriod: true,
        currentPeriod: 1n,
      });
    });
  });

  describe('Method parity tests', () => {
    // Generate individual tests for each enforcer using helper function
    ENFORCER_TEST_CASES.forEach((testCase) => {
      it(`should return identical results for ${testCase.name} (specific vs generic)`, async () => {
        await testMethodParity(testCase, publicClient, mockEnvironment);
      });
    });

    it('should handle custom parameters identically (specific vs generic)', async () => {
      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: mockEnvironment,
      });

      const mockResult = [150n, false, 5n] as const;
      const readContractSpy = vi
        .spyOn(publicClient, 'readContract')
        .mockResolvedValue(mockResult);

      const customDelegationManager = randomAddress();
      const customEnforcerAddress = randomAddress();

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
        delegationManager: customDelegationManager,
        enforcerAddress: customEnforcerAddress,
      };

      const specificResult =
        await utils.getERC20PeriodTransferAvailableAmount(params);
      const genericResult = await utils.getAvailableAmount(
        'ERC20PeriodTransferEnforcer',
        params,
      );

      expect(specificResult).toEqual(genericResult);
      expect(readContractSpy).toHaveBeenCalledTimes(2);

      // Verify both calls used the same custom parameters
      expect(readContractSpy).toHaveBeenNthCalledWith(1, {
        address: customEnforcerAddress,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [params.delegationHash, customDelegationManager, params.terms],
      });

      expect(readContractSpy).toHaveBeenNthCalledWith(2, {
        address: customEnforcerAddress,
        abi: expect.any(Array),
        functionName: 'getAvailableAmount',
        args: [params.delegationHash, customDelegationManager, params.terms],
      });
    });

    it('should verify that generic method internally calls specific methods for all enforcers', async () => {
      for (const testCase of ENFORCER_TEST_CASES) {
        await testInternalMethodCalls(testCase, publicClient, mockEnvironment);
      }
    });
  });

  describe('Error handling', () => {
    it('should throw error if delegation manager not found', async () => {
      const environmentWithoutDelegationManager = {
        ...mockEnvironment,
        DelegationManager: undefined,
      } as any;

      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: environmentWithoutDelegationManager,
      });

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
      };

      await expect(
        utils.getERC20PeriodTransferAvailableAmount(params),
      ).rejects.toThrow('Delegation manager address not found');
    });

    it('should throw error if enforcer not found in environment', async () => {
      const environmentWithoutEnforcer = {
        ...mockEnvironment,
        caveatEnforcers: {
          ...mockEnvironment.caveatEnforcers,
          ERC20PeriodTransferEnforcer: undefined,
        },
      } as any;

      const utils = createCaveatUtils({
        client: publicClient as any,
        environment: environmentWithoutEnforcer,
      });

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
      };

      await expect(
        utils.getERC20PeriodTransferAvailableAmount(params),
      ).rejects.toThrow('ERC20PeriodTransferEnforcer not found in environment');
    });
  });
});
