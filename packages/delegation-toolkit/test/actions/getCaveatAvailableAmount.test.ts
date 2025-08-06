import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { hashDelegation } from '@metamask/delegation-core';
import {
  getMultiTokenPeriodEnforcerAvailableAmount,
  getErc20PeriodTransferEnforcerAvailableAmount,
  getErc20StreamingEnforcerAvailableAmount,
  getNativeTokenPeriodTransferEnforcerAvailableAmount,
  getNativeTokenStreamingEnforcerAvailableAmount,
  type DeleGatorEnvironment,
  type Delegation,
} from '../../src';

// Mock the contract read functions
vi.mock('../../src/DelegationFramework/MultiTokenPeriodEnforcer/methods/getAvailableAmount', () => ({
  read: vi.fn(),
}));

vi.mock('../../src/DelegationFramework/ERC20PeriodTransferEnforcer/methods/getAvailableAmount', () => ({
  read: vi.fn(),
}));

vi.mock('../../src/DelegationFramework/ERC20StreamingEnforcer/methods/getAvailableAmount', () => ({
  read: vi.fn(),
}));

vi.mock('../../src/DelegationFramework/NativeTokenPeriodTransferEnforcer/methods/getAvailableAmount', () => ({
  read: vi.fn(),
}));

vi.mock('../../src/DelegationFramework/NativeTokenStreamingEnforcer/methods/getAvailableAmount', () => ({
  read: vi.fn(),
}));

describe('Delegation-based Caveat Enforcer Actions', () => {
  let client: ReturnType<typeof createPublicClient>;
  let environment: DeleGatorEnvironment;
  let delegation: Delegation;

  beforeEach(() => {
    client = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    environment = {
      DelegationManager: '0x1234567890123456789012345678901234567890',
      EntryPoint: '0x2345678901234567890123456789012345678901',
      SimpleFactory: '0x3456789012345678901234567890123456789012',
      implementations: {},
      caveatEnforcers: {
        MultiTokenPeriodEnforcer: '0x4567890123456789012345678901234567890123',
        ERC20PeriodTransferEnforcer: '0x5678901234567890123456789012345678901234',
        ERC20StreamingEnforcer: '0x6789012345678901234567890123456789012345',
        NativeTokenPeriodTransferEnforcer: '0x7890123456789012345678901234567890123456',
        NativeTokenStreamingEnforcer: '0x8901234567890123456789012345678901234567',
      },
    };

    delegation = {
      delegate: '0x1111111111111111111111111111111111111111',
      delegator: '0x2222222222222222222222222222222222222222',
      authority: '0x0000000000000000000000000000000000000000000000000000000000000000',
      caveats: [
        {
          enforcer: '0x4567890123456789012345678901234567890123',
          terms: '0x1234567890abcdef',
          args: '0xfedcba0987654321',
        },
      ],
      salt: '0x0000000000000000000000000000000000000000000000000000000000000001',
      signature: '0xabcdef1234567890',
    };
  });

  describe('getMultiTokenPeriodEnforcerAvailableAmount with delegation', () => {
    it('should successfully get available amount with matching caveat', async () => {
      const mockResult = {
        availableAmount: 1000n,
        isNewPeriod: true,
        currentPeriod: 1n,
      };

      const { read } = await import('../../src/DelegationFramework/MultiTokenPeriodEnforcer/methods/getAvailableAmount');
      vi.mocked(read).mockResolvedValue(mockResult);

      const result = await getMultiTokenPeriodEnforcerAvailableAmount(
        client,
        environment,
        { delegation },
      );

      expect(result).toEqual(mockResult);
      expect(read).toHaveBeenCalledWith({
        client,
        contractAddress: environment.caveatEnforcers.MultiTokenPeriodEnforcer,
        delegationHash: hashDelegation(delegation),
        delegationManager: environment.DelegationManager,
        terms: delegation.caveats[0].terms,
        args: delegation.caveats[0].args,
      });
    });

    it('should throw Error when no matching caveat is found', async () => {
      const delegationWithoutMatchingCaveat = {
        ...delegation,
        caveats: [
          {
            enforcer: '0x9999999999999999999999999999999999999999',
            terms: '0x1234567890abcdef',
            args: '0xfedcba0987654321',
          },
        ],
      };

      await expect(
        getMultiTokenPeriodEnforcerAvailableAmount(
          client,
          environment,
          { delegation: delegationWithoutMatchingCaveat },
        ),
      ).rejects.toThrow('No caveat found with enforcer matching 0x4567890123456789012345678901234567890123');
    });

    it('should throw Error when multiple matching caveats are found', async () => {
      const delegationWithMultipleMatchingCaveats = {
        ...delegation,
        caveats: [
          {
            enforcer: '0x4567890123456789012345678901234567890123',
            terms: '0x1234567890abcdef',
            args: '0xfedcba0987654321',
          },
          {
            enforcer: '0x4567890123456789012345678901234567890123',
            terms: '0xabcdef1234567890',
            args: '0x1234567890abcdef',
          },
        ],
      };

      await expect(
        getMultiTokenPeriodEnforcerAvailableAmount(
          client,
          environment,
          { delegation: delegationWithMultipleMatchingCaveats },
        ),
      ).rejects.toThrow('Multiple caveats found with enforcer matching 0x4567890123456789012345678901234567890123');
    });


  });

  describe('getErc20PeriodTransferEnforcerAvailableAmount with delegation', () => {
    it('should successfully get available amount with matching caveat', async () => {
      const delegationWithErc20Caveat = {
        ...delegation,
        caveats: [
          {
            enforcer: '0x5678901234567890123456789012345678901234',
            terms: '0x1234567890abcdef',
            args: '0x',
          },
        ],
      };

      const mockResult = {
        availableAmount: 1000n,
        isNewPeriod: true,
        currentPeriod: 1n,
      };

      const { read } = await import('../../src/DelegationFramework/ERC20PeriodTransferEnforcer/methods/getAvailableAmount');
      vi.mocked(read).mockResolvedValue(mockResult);

      const result = await getErc20PeriodTransferEnforcerAvailableAmount(
        client,
        environment,
        { delegation: delegationWithErc20Caveat },
      );

      expect(result).toEqual(mockResult);
      expect(read).toHaveBeenCalledWith({
        client,
        contractAddress: environment.caveatEnforcers.ERC20PeriodTransferEnforcer,
        delegationHash: hashDelegation(delegationWithErc20Caveat),
        delegationManager: environment.DelegationManager,
        terms: delegationWithErc20Caveat.caveats[0].terms,
      });
    });
  });

  describe('getErc20StreamingEnforcerAvailableAmount with delegation', () => {
    it('should successfully get available amount with matching caveat', async () => {
      const delegationWithErc20StreamingCaveat = {
        ...delegation,
        caveats: [
          {
            enforcer: '0x6789012345678901234567890123456789012345',
            terms: '0x1234567890abcdef',
            args: '0x',
          },
        ],
      };

      const mockResult = {
        availableAmount: 1000n,
      };

      const { read } = await import('../../src/DelegationFramework/ERC20StreamingEnforcer/methods/getAvailableAmount');
      vi.mocked(read).mockResolvedValue(mockResult);

      const result = await getErc20StreamingEnforcerAvailableAmount(
        client,
        environment,
        { delegation: delegationWithErc20StreamingCaveat },
      );

      expect(result).toEqual(mockResult);
      expect(read).toHaveBeenCalledWith({
        client,
        contractAddress: environment.caveatEnforcers.ERC20StreamingEnforcer,
        delegationManager: environment.DelegationManager,
        delegationHash: hashDelegation(delegationWithErc20StreamingCaveat),
        terms: delegationWithErc20StreamingCaveat.caveats[0].terms,
      });
    });
  });

  describe('getNativeTokenPeriodTransferEnforcerAvailableAmount with delegation', () => {
    it('should successfully get available amount with matching caveat', async () => {
      const delegationWithNativeTokenCaveat = {
        ...delegation,
        caveats: [
          {
            enforcer: '0x7890123456789012345678901234567890123456',
            terms: '0x1234567890abcdef',
            args: '0x',
          },
        ],
      };

      const mockResult = {
        availableAmount: 1000n,
        isNewPeriod: true,
        currentPeriod: 1n,
      };

      const { read } = await import('../../src/DelegationFramework/NativeTokenPeriodTransferEnforcer/methods/getAvailableAmount');
      vi.mocked(read).mockResolvedValue(mockResult);

      const result = await getNativeTokenPeriodTransferEnforcerAvailableAmount(
        client,
        environment,
        { delegation: delegationWithNativeTokenCaveat },
      );

      expect(result).toEqual(mockResult);
      expect(read).toHaveBeenCalledWith({
        client,
        contractAddress: environment.caveatEnforcers.NativeTokenPeriodTransferEnforcer,
        delegationHash: hashDelegation(delegationWithNativeTokenCaveat),
        delegationManager: environment.DelegationManager,
        terms: delegationWithNativeTokenCaveat.caveats[0].terms,
      });
    });
  });

  describe('getNativeTokenStreamingEnforcerAvailableAmount with delegation', () => {
    it('should successfully get available amount with matching caveat', async () => {
      const delegationWithNativeTokenStreamingCaveat = {
        ...delegation,
        caveats: [
          {
            enforcer: '0x8901234567890123456789012345678901234567',
            terms: '0x1234567890abcdef',
            args: '0x',
          },
        ],
      };

      const mockResult = {
        availableAmount: 1000n,
      };

      const { read } = await import('../../src/DelegationFramework/NativeTokenStreamingEnforcer/methods/getAvailableAmount');
      vi.mocked(read).mockResolvedValue(mockResult);

      const result = await getNativeTokenStreamingEnforcerAvailableAmount(
        client,
        environment,
        { delegation: delegationWithNativeTokenStreamingCaveat },
      );

      expect(result).toEqual(mockResult);
      expect(read).toHaveBeenCalledWith({
        client,
        contractAddress: environment.caveatEnforcers.NativeTokenStreamingEnforcer,
        delegationManager: environment.DelegationManager,
        delegationHash: hashDelegation(delegationWithNativeTokenStreamingCaveat),
        terms: delegationWithNativeTokenStreamingCaveat.caveats[0].terms,
      });
    });
  });

  describe('Error handling', () => {
    it('should throw error when delegation manager is not found in environment', async () => {
      const environmentWithoutDelegationManager = {
        ...environment,
        DelegationManager: undefined as any,
      };

      await expect(
        getMultiTokenPeriodEnforcerAvailableAmount(
          client,
          environmentWithoutDelegationManager,
          { delegation },
        ),
      ).rejects.toThrow('Delegation manager address not found');
    });

    it('should throw error when enforcer is not found in environment', async () => {
      const environmentWithoutEnforcer = {
        ...environment,
        caveatEnforcers: {
          ...environment.caveatEnforcers,
          MultiTokenPeriodEnforcer: undefined as any,
        },
      };

      await expect(
        getMultiTokenPeriodEnforcerAvailableAmount(
          client,
          environmentWithoutEnforcer,
          { delegation },
        ),
      ).rejects.toThrow('MultiTokenPeriodEnforcer not found in environment');
    });
  });
});