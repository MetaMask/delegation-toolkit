import { type PublicClient, createPublicClient, http, type Hex } from 'viem';
import { sepolia } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { randomAddress, randomBytes } from './utils';
import {
  createCaveatEnforcerClient,
  getErc20PeriodTransferEnforcerAvailableAmount,
  getErc20StreamingEnforcerAvailableAmount,
  getMultiTokenPeriodEnforcerAvailableAmount,
  getNativeTokenPeriodTransferEnforcerAvailableAmount,
  getNativeTokenStreamingEnforcerAvailableAmount,
} from '../src/actions/getCaveatAvailableAmount';
import type {
  CaveatEnforcerParams,
  type CaveatEnforcerClient,
} from '../src/actions/getCaveatAvailableAmount';
import {
  ERC20PeriodTransferEnforcer,
  MultiTokenPeriodEnforcer,
  NativeTokenPeriodTransferEnforcer,
  ERC20StreamingEnforcer,
  NativeTokenStreamingEnforcer,
} from '../src/contracts';
import { getDelegationHashOffchain } from '../src/delegation';
import type { DeleGatorEnvironment } from '../src/types';

// Helper function to generate random bytes32
const randomBytes32 = (): Hex => randomBytes(32);

describe('Caveat Contract Methods', () => {
  let publicClient: PublicClient;
  let mockEnvironment: DeleGatorEnvironment;
  let caveatClient: CaveatEnforcerClient;

  const createParams = (caveat: {
    enforcer: string;
    terms: Hex;
    args?: Hex;
  }): CaveatEnforcerParams => {
    const enforcer = mockEnvironment.caveatEnforcers[caveat.enforcer];
    if (!enforcer) {
      throw new Error(`Enforcer ${caveat.enforcer} not found`);
    }

    const { terms, args = '0x' } = caveat;

    return {
      delegation: {
        delegator: randomAddress(),
        delegate: randomAddress(),
        authority: randomBytes32(),
        caveats: [
          {
            enforcer,
            terms,
            args,
          },
        ],
        salt: '0x00',
        signature: randomBytes32(),
      },
    };
  };

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
    caveatClient = createCaveatEnforcerClient({
      client: publicClient,
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
      const terms = '0x1234' as Hex;

      const result = await ERC20StreamingEnforcer.read.getAvailableAmount({
        client: publicClient,
        contractAddress,
        delegationManager,
        delegationHash,
        terms,
      });

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress,
        delegationManager,
        delegationHash,
        terms,
      });

      expect(result).toEqual(mockResult);
    });
  });

  describe('NativeTokenStreamingEnforcer', () => {
    it('should call getAvailableAmount with correct parameters', async () => {
      const mockResult = {
        availableAmount: 300n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(NativeTokenStreamingEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const contractAddress = randomAddress();
      const delegationManager = randomAddress();
      const delegationHash = randomBytes32();
      const terms = '0x1234' as Hex;

      const result = await NativeTokenStreamingEnforcer.read.getAvailableAmount(
        {
          client: publicClient,
          contractAddress,
          delegationManager,
          delegationHash,
          terms,
        },
      );

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress,
        delegationManager,
        delegationHash,
        terms,
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

      const enforcer =
        mockEnvironment.caveatEnforcers.ERC20PeriodTransferEnforcer;

      if (!enforcer) {
        throw new Error('ERC20PeriodTransferEnforcer not found');
      }

      const terms = '0x1234';

      const params = createParams({
        enforcer: 'ERC20PeriodTransferEnforcer',
        terms,
      });

      const delegationHash = getDelegationHashOffchain(params.delegation);

      const result =
        await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount(
          params,
        );

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress:
          mockEnvironment.caveatEnforcers.ERC20PeriodTransferEnforcer,
        delegationHash,
        delegationManager: mockEnvironment.DelegationManager,
        terms,
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

      const terms = '0x1234';
      const args = '0x5678';

      const params = createParams({
        enforcer: 'MultiTokenPeriodEnforcer',
        terms,
        args,
      });

      const delegationHash = getDelegationHashOffchain(params.delegation);

      const result =
        await caveatClient.getMultiTokenPeriodEnforcerAvailableAmount(params);

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress:
          mockEnvironment.caveatEnforcers.MultiTokenPeriodEnforcer,
        delegationHash,
        delegationManager: mockEnvironment.DelegationManager,
        terms,
        args,
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

      const terms = '0x1234';

      const params = createParams({
        enforcer: 'ERC20StreamingEnforcer',
        terms,
      });

      const delegationHash = getDelegationHashOffchain({
        ...params.delegation,
        salt: 0n,
      });

      const result =
        await caveatClient.getErc20StreamingEnforcerAvailableAmount(params);

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress: mockEnvironment.caveatEnforcers.ERC20StreamingEnforcer,
        delegationManager: mockEnvironment.DelegationManager,
        delegationHash,
        terms,
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

      const terms = '0x1234';

      const params = createParams({
        enforcer: 'NativeTokenPeriodTransferEnforcer',
        terms,
      });

      const delegationHash = getDelegationHashOffchain(params.delegation);

      const result =
        await caveatClient.getNativeTokenPeriodTransferEnforcerAvailableAmount(
          params,
        );

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress:
          mockEnvironment.caveatEnforcers.NativeTokenPeriodTransferEnforcer,
        delegationHash,
        delegationManager: mockEnvironment.DelegationManager,
        terms,
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

      const terms = '0x1234';

      const params = createParams({
        enforcer: 'NativeTokenStreamingEnforcer',
        terms,
      });

      const delegationHash = getDelegationHashOffchain(params.delegation);

      const result =
        await caveatClient.getNativeTokenStreamingEnforcerAvailableAmount(
          params,
        );

      expect(getAvailableAmountSpy).toHaveBeenCalledWith({
        client: publicClient,
        contractAddress:
          mockEnvironment.caveatEnforcers.NativeTokenStreamingEnforcer,
        delegationManager: mockEnvironment.DelegationManager,
        delegationHash,
        terms,
      });

      expect(result).toEqual(mockResult);
    });

    describe('Error handling', () => {
      it('should throw error if delegation manager not found', async () => {
        const environmentWithoutDelegationManager = {
          ...mockEnvironment,
          DelegationManager: undefined,
        } as unknown as DeleGatorEnvironment;

        const clientWithoutDelegationManager = createCaveatEnforcerClient({
          client: publicClient,
          environment: environmentWithoutDelegationManager,
        });

        const params = createParams({
          enforcer: 'ERC20PeriodTransferEnforcer',
          terms: '0x1234' as Hex,
        });

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
        } as unknown as DeleGatorEnvironment;

        const clientWithoutEnforcer = createCaveatEnforcerClient({
          client: publicClient,
          environment: environmentWithoutEnforcer,
        });

        const params = createParams({
          enforcer: 'ERC20PeriodTransferEnforcer',
          terms: '0x1234' as Hex,
        });

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

  describe('Individual Functions vs Client Extension', () => {
    it('should return identical results for ERC20PeriodTransferEnforcer', async () => {
      const mockResult = {
        availableAmount: 100n,
        isNewPeriod: true,
        currentPeriod: 1n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(ERC20PeriodTransferEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const terms = '0x1234';

      const params = createParams({
        enforcer: 'ERC20PeriodTransferEnforcer',
        terms,
      });

      // Test both approaches
      const [clientResult, functionResult] = await Promise.all([
        caveatClient.getErc20PeriodTransferEnforcerAvailableAmount(params),
        getErc20PeriodTransferEnforcerAvailableAmount(
          publicClient,
          mockEnvironment,
          params,
        ),
      ]);

      expect(clientResult).toEqual(functionResult);
      expect(clientResult).toEqual(mockResult);
      expect(getAvailableAmountSpy).toHaveBeenCalledTimes(2);
    });

    it('should return identical results for ERC20StreamingEnforcer', async () => {
      const mockResult = {
        availableAmount: 500n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(ERC20StreamingEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const params = createParams({
        enforcer: 'ERC20StreamingEnforcer',
        terms: '0x1234' as Hex,
        args: '0x5678' as Hex,
      });

      // Test both approaches
      const [clientResult, functionResult] = await Promise.all([
        caveatClient.getErc20StreamingEnforcerAvailableAmount(params),
        getErc20StreamingEnforcerAvailableAmount(
          publicClient,
          mockEnvironment,
          params,
        ),
      ]);

      expect(clientResult).toEqual(functionResult);
      expect(clientResult).toEqual(mockResult);
      expect(getAvailableAmountSpy).toHaveBeenCalledTimes(2);
    });

    it('should return identical results for MultiTokenPeriodEnforcer', async () => {
      const mockResult = {
        availableAmount: 200n,
        isNewPeriod: false,
        currentPeriod: 2n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(MultiTokenPeriodEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const params = createParams({
        enforcer: 'MultiTokenPeriodEnforcer',
        terms: '0x1234' as Hex,
        args: '0x5678' as Hex,
      });

      // Test both approaches
      const [clientResult, functionResult] = await Promise.all([
        caveatClient.getMultiTokenPeriodEnforcerAvailableAmount(params),
        getMultiTokenPeriodEnforcerAvailableAmount(
          publicClient,
          mockEnvironment,
          params,
        ),
      ]);

      expect(clientResult).toEqual(functionResult);
      expect(clientResult).toEqual(mockResult);
      expect(getAvailableAmountSpy).toHaveBeenCalledTimes(2);
    });

    it('should return identical results for NativeTokenPeriodTransferEnforcer', async () => {
      const mockResult = {
        availableAmount: 300n,
        isNewPeriod: true,
        currentPeriod: 3n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(NativeTokenPeriodTransferEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const params = createParams({
        enforcer: 'NativeTokenPeriodTransferEnforcer',
        terms: '0x9abc',
      });

      // Test both approaches
      const [clientResult, functionResult] = await Promise.all([
        caveatClient.getNativeTokenPeriodTransferEnforcerAvailableAmount(
          params,
        ),
        getNativeTokenPeriodTransferEnforcerAvailableAmount(
          publicClient,
          mockEnvironment,
          params,
        ),
      ]);

      expect(clientResult).toEqual(functionResult);
      expect(clientResult).toEqual(mockResult);
      expect(getAvailableAmountSpy).toHaveBeenCalledTimes(2);
    });

    it('should return identical results for NativeTokenStreamingEnforcer', async () => {
      const mockResult = {
        availableAmount: 600n,
      };

      const getAvailableAmountSpy = vi
        .spyOn(NativeTokenStreamingEnforcer.read, 'getAvailableAmount')
        .mockResolvedValue(mockResult);

      const params = createParams({
        enforcer: 'NativeTokenStreamingEnforcer',
        terms: '0x1234',
      });

      // Test both approaches
      const [clientResult, functionResult] = await Promise.all([
        caveatClient.getNativeTokenStreamingEnforcerAvailableAmount(params),
        getNativeTokenStreamingEnforcerAvailableAmount(
          publicClient,
          mockEnvironment,
          params,
        ),
      ]);

      expect(clientResult).toEqual(functionResult);
      expect(clientResult).toEqual(mockResult);
      expect(getAvailableAmountSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle errors identically', async () => {
      const mockError = new Error('Contract call failed');

      vi.spyOn(
        ERC20PeriodTransferEnforcer.read,
        'getAvailableAmount',
      ).mockRejectedValue(mockError);

      const params = createParams({
        enforcer: 'ERC20PeriodTransferEnforcer',
        terms: '0x1234',
      });

      // Both approaches should throw the same error
      await expect(
        caveatClient.getErc20PeriodTransferEnforcerAvailableAmount(params),
      ).rejects.toThrow('Contract call failed');

      await expect(
        getErc20PeriodTransferEnforcerAvailableAmount(
          publicClient,
          mockEnvironment,
          params,
        ),
      ).rejects.toThrow('Contract call failed');
    });
  });
});
