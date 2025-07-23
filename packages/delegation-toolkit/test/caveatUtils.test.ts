import { createPublicClient, http, type Hex } from 'viem';
import { sepolia } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { randomAddress, randomBytes } from './utils';
import {
  createCaveatEnforcerClient,
  type CaveatEnforcerClient,
} from '../src/actions';
import {
  ERC20PeriodTransferEnforcer,
  MultiTokenPeriodEnforcer,
  NativeTokenPeriodTransferEnforcer,
  ERC20StreamingEnforcer,
  NativeTokenStreamingEnforcer,
} from '../src/contracts';
import type { DeleGatorEnvironment } from '../src/types';

// Helper function to generate random bytes32
const randomBytes32 = (): Hex => randomBytes(32);

describe('Caveat Contract Methods', () => {
  let publicClient: ReturnType<typeof createPublicClient>;
  let mockEnvironment: DeleGatorEnvironment;
  let caveatClient: CaveatEnforcerClient;

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

    // Create caveat client for tests
    caveatClient = createCaveatEnforcerClient(publicClient as any, {
      environment: mockEnvironment,
    });

    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('ERC20PeriodTransferEnforcer', () => {
    it('should call getAvailableAmount with correct parameters', async () => {
      const mockResult = {
        availableAmount: 100n,
        isNewPeriod: true,
        currentPeriod: 1n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(ERC20PeriodTransferEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const contractAddress = randomAddress();
      const delegationHash = randomBytes32();
      const delegationManager = randomAddress();
      const terms = '0x1234' as Hex;

      const result = await ERC20PeriodTransferEnforcer.read.getAvailableAmount({
        client: publicClient,
        contractAddress,
        delegationHash,
        delegationManager,
        terms,
      });

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress,
        delegationHash,
        delegationManager,
        terms,
      });

      expect(result).toEqual(mockResult);
    });
  });

  describe('MultiTokenPeriodEnforcer', () => {
    it('should call getAvailableAmount with correct parameters including args', async () => {
      const mockResult = {
        availableAmount: 200n,
        isNewPeriod: false,
        currentPeriod: 2n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(MultiTokenPeriodEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const contractAddress = randomAddress();
      const delegationHash = randomBytes32();
      const delegationManager = randomAddress();
      const terms = '0x1234' as Hex;
      const args = '0x5678' as Hex;

      const result = await MultiTokenPeriodEnforcer.read.getAvailableAmount({
        client: publicClient,
        contractAddress,
        delegationHash,
        delegationManager,
        terms,
        args,
      });

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress,
        delegationHash,
        delegationManager,
        terms,
        args,
      });

      expect(result).toEqual(mockResult);
    });
  });

  describe('NativeTokenPeriodTransferEnforcer', () => {
    it('should call getAvailableAmount with correct parameters', async () => {
      const mockResult = {
        availableAmount: 300n,
        isNewPeriod: true,
        currentPeriod: 3n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(NativeTokenPeriodTransferEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const contractAddress = randomAddress();
      const delegationHash = randomBytes32();
      const delegationManager = randomAddress();
      const terms = '0x9abc' as Hex;

      const result =
        await NativeTokenPeriodTransferEnforcer.read.getAvailableAmount({
          client: publicClient,
          contractAddress,
          delegationHash,
          delegationManager,
          terms,
        });

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress,
        delegationHash,
        delegationManager,
        terms,
      });

      expect(result).toEqual(mockResult);
    });
  });

  describe('ERC20StreamingEnforcer', () => {
    it('should call getAvailableAmount with correct parameters', async () => {
      const mockResult = {
        availableAmount: 500n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(ERC20StreamingEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const contractAddress = randomAddress();
      const delegationManager = randomAddress();
      const delegationHash = randomBytes32();

      const result = await ERC20StreamingEnforcer.read.getAvailableAmount({
        client: publicClient,
        contractAddress,
        delegationManager,
        delegationHash,
      });

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress,
        delegationManager,
        delegationHash,
      });

      expect(result).toEqual(mockResult);
    });
  });

  describe('NativeTokenStreamingEnforcer', () => {
    it('should call getAvailableAmount with correct parameters', async () => {
      const mockResult = {
        availableAmount: 600n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(NativeTokenStreamingEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const contractAddress = randomAddress();
      const delegationManager = randomAddress();
      const delegationHash = randomBytes32();

      const result = await NativeTokenStreamingEnforcer.read.getAvailableAmount(
        {
          client: publicClient,
          contractAddress,
          delegationManager,
          delegationHash,
        },
      );

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress,
        delegationManager,
        delegationHash,
      });

      expect(result).toEqual(mockResult);
    });
  });

  describe('Caveat Enforcer Client', () => {
    it('should route to correct enforcer method - ERC20PeriodTransferEnforcer', async () => {
      const mockResult = {
        availableAmount: 100n,
        isNewPeriod: true,
        currentPeriod: 1n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(ERC20PeriodTransferEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
      };

      const result =
        await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount(
          params,
        );

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress:
          mockEnvironment.caveatEnforcers.ERC20PeriodTransferEnforcer,
        delegationHash: params.delegationHash,
        delegationManager: mockEnvironment.DelegationManager,
        terms: params.terms,
      });

      expect(result).toEqual(mockResult);
    });

    it('should route to correct enforcer method - MultiTokenPeriodEnforcer', async () => {
      const mockResult = {
        availableAmount: 200n,
        isNewPeriod: false,
        currentPeriod: 2n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(MultiTokenPeriodEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
        args: '0x5678' as Hex,
      };

      const result =
        await caveatClient.getMultiTokenPeriodEnforcerAvailableAmount(params);

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress:
          mockEnvironment.caveatEnforcers.MultiTokenPeriodEnforcer,
        delegationHash: params.delegationHash,
        delegationManager: mockEnvironment.DelegationManager,
        terms: params.terms,
        args: params.args,
      });

      expect(result).toEqual(mockResult);
    });

    it('should route to correct enforcer method - ERC20StreamingEnforcer', async () => {
      const mockResult = {
        availableAmount: 500n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(ERC20StreamingEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
      };

      const result =
        await caveatClient.getErc20StreamingEnforcerAvailableAmount(params);

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress: mockEnvironment.caveatEnforcers.ERC20StreamingEnforcer,
        delegationManager: mockEnvironment.DelegationManager,
        delegationHash: params.delegationHash,
      });

      expect(result).toEqual(mockResult);
    });

    it('should route to correct enforcer method - NativeTokenPeriodTransferEnforcer', async () => {
      const mockResult = {
        availableAmount: 300n,
        isNewPeriod: true,
        currentPeriod: 3n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(NativeTokenPeriodTransferEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
        terms: '0x9abc' as Hex,
      };

      const result =
        await caveatClient.getNativeTokenPeriodTransferEnforcerAvailableAmount(
          params,
        );

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress:
          mockEnvironment.caveatEnforcers.NativeTokenPeriodTransferEnforcer,
        delegationHash: params.delegationHash,
        delegationManager: mockEnvironment.DelegationManager,
        terms: params.terms,
      });

      expect(result).toEqual(mockResult);
    });

    it('should route to correct enforcer method - NativeTokenStreamingEnforcer', async () => {
      const mockResult = {
        availableAmount: 600n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(NativeTokenStreamingEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const params = {
        delegationHash: randomBytes32(),
      };

      const result =
        await caveatClient.getNativeTokenStreamingEnforcerAvailableAmount(
          params,
        );

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress:
          mockEnvironment.caveatEnforcers.NativeTokenStreamingEnforcer,
        delegationManager: mockEnvironment.DelegationManager,
        delegationHash: params.delegationHash,
      });

      expect(result).toEqual(mockResult);
    });

    it('should use custom delegation manager when provided', async () => {
      const mockResult = {
        availableAmount: 100n,
        isNewPeriod: true,
        currentPeriod: 1n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(ERC20PeriodTransferEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const customDelegationManager = randomAddress();
      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
        delegationManager: customDelegationManager,
      };

      await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount(params);

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress:
          mockEnvironment.caveatEnforcers.ERC20PeriodTransferEnforcer,
        delegationHash: params.delegationHash,
        delegationManager: customDelegationManager,
        terms: params.terms,
      });
    });

    it('should use custom enforcer address when provided', async () => {
      const mockResult = {
        availableAmount: 100n,
        isNewPeriod: true,
        currentPeriod: 1n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(ERC20PeriodTransferEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const customEnforcerAddress = randomAddress();
      const params = {
        delegationHash: randomBytes32(),
        terms: '0x1234' as Hex,
        enforcerAddress: customEnforcerAddress,
      };

      await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount(params);

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress: customEnforcerAddress,
        delegationHash: params.delegationHash,
        delegationManager: mockEnvironment.DelegationManager,
        terms: params.terms,
      });
    });

    describe('Error handling', () => {
      it('should throw error if delegation manager not found', async () => {
        const environmentWithoutDelegationManager = {
          ...mockEnvironment,
          DelegationManager: undefined,
        } as any;

        const clientWithoutDelegationManager = createCaveatEnforcerClient(
          publicClient as any,
          {
            environment: environmentWithoutDelegationManager,
          },
        );

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
        };

        await expect(
          clientWithoutDelegationManager.getErc20PeriodTransferEnforcerAvailableAmount(
            params,
          ),
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

        const clientWithoutEnforcer = createCaveatEnforcerClient(
          publicClient as any,
          {
            environment: environmentWithoutEnforcer,
          },
        );

        const params = {
          delegationHash: randomBytes32(),
          terms: '0x1234' as Hex,
        };

        await expect(
          clientWithoutEnforcer.getErc20PeriodTransferEnforcerAvailableAmount(
            params,
          ),
        ).rejects.toThrow(
          'ERC20PeriodTransferEnforcer not found in environment',
        );
      });
    });
  });
});
