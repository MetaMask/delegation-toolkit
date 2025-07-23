import { createPublicClient, http, type Hex } from 'viem';
import { sepolia } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { randomAddress, randomBytes } from './utils';
import {
  caveatUtilsActions,
  getERC20PeriodTransferAvailableAmountAction,
  getMultiTokenPeriodAvailableAmountAction,
  getNativeTokenPeriodTransferAvailableAmountAction,
  getERC20StreamingAvailableAmountAction,
  getNativeTokenStreamingAvailableAmountAction,
  getCaveatAvailableAmountAction,
} from '../src/caveatUtils/index';
import type { DeleGatorEnvironment } from '../src/types';

// Helper function to generate random bytes32
const randomBytes32 = (): Hex => randomBytes(32);

// Test configuration for all caveat enforcers
const ENFORCER_TEST_CASES = [
  {
    name: 'ERC20PeriodTransferEnforcer' as const,
    method: 'getERC20PeriodTransferAvailableAmount' as const,
    action: getERC20PeriodTransferAvailableAmountAction,
    mockResult: [100n, true, 1n] as const,
    params: () => ({
      delegationHash: randomBytes32(),
      terms: '0x1234' as Hex,
    }),
  },
  {
    name: 'MultiTokenPeriodEnforcer' as const,
    method: 'getMultiTokenPeriodAvailableAmount' as const,
    action: getMultiTokenPeriodAvailableAmountAction,
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
    action: getNativeTokenPeriodTransferAvailableAmountAction,
    mockResult: [300n, true, 3n] as const,
    params: () => ({
      delegationHash: randomBytes32(),
      terms: '0x9abc' as Hex,
    }),
  },
  {
    name: 'ERC20StreamingEnforcer' as const,
    method: 'getERC20StreamingAvailableAmount' as const,
    action: getERC20StreamingAvailableAmountAction,
    mockResult: 500n,
    params: () => ({
      delegationHash: randomBytes32(),
    }),
  },
  {
    name: 'NativeTokenStreamingEnforcer' as const,
    method: 'getNativeTokenStreamingAvailableAmount' as const,
    action: getNativeTokenStreamingAvailableAmountAction,
    mockResult: 600n,
    params: () => ({
      delegationHash: randomBytes32(),
    }),
  },
];

// Helper function to test method parity between action function and extended client method
const testActionMethodParity = async (
  testCase: (typeof ENFORCER_TEST_CASES)[0],
  publicClient: any,
  mockEnvironment: any,
) => {
  // Test direct action function
  const readContractSpy = vi
    .spyOn(publicClient, 'readContract')
    .mockResolvedValue(testCase.mockResult);

  const params = testCase.params();

  const directActionResult = await testCase.action(
    publicClient,
    params as any,
    { environment: mockEnvironment },
  );

  // Test extended client action
  const extendedClient = publicClient.extend(
    caveatUtilsActions({ environment: mockEnvironment }),
  );
  const extendedResult = await (extendedClient as any)[testCase.method](params);

  expect(directActionResult).toEqual(extendedResult);
  expect(readContractSpy).toHaveBeenCalledTimes(2);

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

  describe('Viem Actions Pattern', () => {
    describe('caveatUtilsActions', () => {
      it('should extend client with caveat utility methods', () => {
        const extendedClient = publicClient.extend(caveatUtilsActions());

        expect(extendedClient).toHaveProperty(
          'getERC20PeriodTransferAvailableAmount',
        );
        expect(extendedClient).toHaveProperty(
          'getMultiTokenPeriodAvailableAmount',
        );
        expect(extendedClient).toHaveProperty(
          'getNativeTokenPeriodTransferAvailableAmount',
        );
        expect(extendedClient).toHaveProperty(
          'getERC20StreamingAvailableAmount',
        );
        expect(extendedClient).toHaveProperty(
          'getNativeTokenStreamingAvailableAmount',
        );
        expect(extendedClient).toHaveProperty('getCaveatAvailableAmount');
      });

      it('should extend client with custom environment config', () => {
        const extendedClient = publicClient.extend(
          caveatUtilsActions({ environment: mockEnvironment }),
        );

        expect(extendedClient).toHaveProperty(
          'getERC20PeriodTransferAvailableAmount',
        );
        expect(
          typeof extendedClient.getERC20PeriodTransferAvailableAmount,
        ).toBe('function');
      });

      it('should auto-detect environment from client when no config provided', () => {
        const extendedClient = publicClient.extend(caveatUtilsActions());

        expect(extendedClient).toHaveProperty(
          'getERC20PeriodTransferAvailableAmount',
        );
        expect(
          typeof extendedClient.getERC20PeriodTransferAvailableAmount,
        ).toBe('function');
      });
    });

    describe('ERC20PeriodTransferEnforcer Action', () => {
      it('should work with extended client', async () => {
        const extendedClient = publicClient.extend(
          caveatUtilsActions({ environment: mockEnvironment }),
        );

        const mockResult = [100n, true, 1n] as const;
        const readContractSpy = vi
          .spyOn(publicClient, 'readContract')
          .mockResolvedValue(mockResult);

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
        };

        const result =
          await extendedClient.getERC20PeriodTransferAvailableAmount(params);

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

      it('should work with direct action function call', async () => {
        const mockResult = [100n, true, 1n] as const;
        const readContractSpy = vi
          .spyOn(publicClient, 'readContract')
          .mockResolvedValue(mockResult);

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
        };

        const result = await getERC20PeriodTransferAvailableAmountAction(
          publicClient as any,
          params,
          { environment: mockEnvironment },
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

      it('should use custom delegation manager when provided', async () => {
        const extendedClient = publicClient.extend(
          caveatUtilsActions({ environment: mockEnvironment }),
        );
        const customDelegationManager = randomAddress();

        const mockResult = [100n, true, 1n] as const;
        const readContractSpy = vi
          .spyOn(publicClient, 'readContract')
          .mockResolvedValue(mockResult);

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
          delegationManager: customDelegationManager,
        };

        await extendedClient.getERC20PeriodTransferAvailableAmount(params);

        expect(readContractSpy).toHaveBeenCalledWith({
          address: mockEnvironment.caveatEnforcers.ERC20PeriodTransferEnforcer,
          abi: expect.any(Array),
          functionName: 'getAvailableAmount',
          args: [params.delegationHash, customDelegationManager, params.terms],
        });
      });

      it('should use custom enforcer address when provided', async () => {
        const extendedClient = publicClient.extend(
          caveatUtilsActions({ environment: mockEnvironment }),
        );
        const customEnforcerAddress = randomAddress();

        const mockResult = [100n, true, 1n] as const;
        const readContractSpy = vi
          .spyOn(publicClient, 'readContract')
          .mockResolvedValue(mockResult);

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
          enforcerAddress: customEnforcerAddress,
        };

        await extendedClient.getERC20PeriodTransferAvailableAmount(params);

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

    describe('MultiTokenPeriodEnforcer Action', () => {
      it('should call getAvailableAmount with correct parameters including args', async () => {
        const extendedClient = publicClient.extend(
          caveatUtilsActions({ environment: mockEnvironment }),
        );

        const mockResult = [200n, false, 2n] as const;
        const readContractSpy = vi
          .spyOn(publicClient, 'readContract')
          .mockResolvedValue(mockResult);

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
          args: '0x5678' as Hex,
        };

        const result =
          await extendedClient.getMultiTokenPeriodAvailableAmount(params);

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

    describe('Generic getCaveatAvailableAmount Action', () => {
      it('should route to correct enforcer method via extended client', async () => {
        const extendedClient = publicClient.extend(
          caveatUtilsActions({ environment: mockEnvironment }),
        );

        const mockResult = [100n, true, 1n] as const;
        const readContractSpy = vi
          .spyOn(publicClient, 'readContract')
          .mockResolvedValue(mockResult);

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
        };

        const result = await extendedClient.getCaveatAvailableAmount(
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
        const extendedClient = publicClient.extend(
          caveatUtilsActions({ environment: mockEnvironment }),
        );

        await expect(
          extendedClient.getCaveatAvailableAmount(
            'UnsupportedEnforcer' as any,
            {} as any,
          ),
        ).rejects.toThrow('Unsupported caveat enforcer: UnsupportedEnforcer');
      });

      it('should work with direct action function call', async () => {
        const mockResult = [100n, true, 1n] as const;
        const readContractSpy = vi
          .spyOn(publicClient, 'readContract')
          .mockResolvedValue(mockResult);

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
        };

        const result = await getCaveatAvailableAmountAction(
          publicClient as any,
          'ERC20PeriodTransferEnforcer',
          params,
          { environment: mockEnvironment },
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

    describe('Action vs Extended Client Method Parity', () => {
      // Generate individual tests for each enforcer using helper function
      ENFORCER_TEST_CASES.forEach((testCase) => {
        it(`should return identical results for ${testCase.name} (direct action vs extended client)`, async () => {
          await testActionMethodParity(testCase, publicClient, mockEnvironment);
        });
      });
    });

    describe('Error handling', () => {
      it('should throw error if delegation manager not found', async () => {
        const environmentWithoutDelegationManager = {
          ...mockEnvironment,
          DelegationManager: undefined,
        } as any;

        const extendedClient = publicClient.extend(
          caveatUtilsActions({
            environment: environmentWithoutDelegationManager,
          }),
        );

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
        };

        await expect(
          extendedClient.getERC20PeriodTransferAvailableAmount(params),
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

        const extendedClient = publicClient.extend(
          caveatUtilsActions({ environment: environmentWithoutEnforcer }),
        );

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
        };

        await expect(
          extendedClient.getERC20PeriodTransferAvailableAmount(params),
        ).rejects.toThrow(
          'ERC20PeriodTransferEnforcer not found in environment',
        );
      });
    });
  });
});
