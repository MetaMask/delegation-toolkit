import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  createCaveatEnforcerClient,
  type CaveatEnforcerClient,
} from '../../src/actions/getCaveatAvailableAmount';
import { getDelegationHashOffchain } from '../../src/delegation';
import type { DeleGatorEnvironment, Delegation } from '../../src/types';

// Mock the contract read functions
vi.mock(
  '../../src/DelegationFramework/MultiTokenPeriodEnforcer/methods/getAvailableAmount',
  () => ({
    read: vi.fn(),
  }),
);

vi.mock(
  '../../src/DelegationFramework/ERC20PeriodTransferEnforcer/methods/getAvailableAmount',
  () => ({
    read: vi.fn(),
  }),
);

describe('CaveatEnforcerClient', () => {
  let client: CaveatEnforcerClient;
  let environment: DeleGatorEnvironment;
  let delegation: Delegation;

  beforeEach(() => {
    const baseClient = createPublicClient({
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
        ERC20PeriodTransferEnforcer:
          '0x5678901234567890123456789012345678901234',
        ERC20StreamingEnforcer: '0x6789012345678901234567890123456789012345',
        NativeTokenPeriodTransferEnforcer:
          '0x7890123456789012345678901234567890123456',
        NativeTokenStreamingEnforcer:
          '0x8901234567890123456789012345678901234567',
      },
    };

    client = createCaveatEnforcerClient({
      client: baseClient,
      environment,
    });

    delegation = {
      delegate: '0x1111111111111111111111111111111111111111',
      delegator: '0x2222222222222222222222222222222222222222',
      authority:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
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
    it('should successfully get available amount using client', async () => {
      const mockResult = {
        availableAmount: 1000n,
        isNewPeriod: true,
        currentPeriod: 1n,
      };

      const { read } = await import(
        '../../src/DelegationFramework/MultiTokenPeriodEnforcer/methods/getAvailableAmount'
      );
      vi.mocked(read).mockResolvedValue(mockResult);

      const result = await client.getMultiTokenPeriodEnforcerAvailableAmount({
        delegation,
      });

      const delegationHash = getDelegationHashOffchain(delegation);

      expect(result).toEqual(mockResult);
      expect(read).toHaveBeenCalledWith({
        client: expect.any(Object),
        contractAddress: environment.caveatEnforcers.MultiTokenPeriodEnforcer,
        delegationHash,
        delegationManager: environment.DelegationManager,
        terms: delegation.caveats[0]?.terms,
        args: delegation.caveats[0]?.args,
      });
    });
  });

  describe('getErc20PeriodTransferEnforcerAvailableAmount with delegation', () => {
    it('should successfully get available amount using client', async () => {
      const delegationWithErc20Caveat: Delegation = {
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

      const { read } = await import(
        '../../src/DelegationFramework/ERC20PeriodTransferEnforcer/methods/getAvailableAmount'
      );
      vi.mocked(read).mockResolvedValue(mockResult);

      const result = await client.getErc20PeriodTransferEnforcerAvailableAmount(
        {
          delegation: delegationWithErc20Caveat,
        },
      );

      const delegationHash = getDelegationHashOffchain(
        delegationWithErc20Caveat,
      );

      expect(result).toEqual(mockResult);
      expect(read).toHaveBeenCalledWith({
        client: expect.any(Object),
        contractAddress:
          environment.caveatEnforcers.ERC20PeriodTransferEnforcer,
        delegationHash,
        delegationManager: environment.DelegationManager,
        terms: delegationWithErc20Caveat.caveats[0]?.terms,
      });
    });
  });

  describe('Client type', () => {
    it('should have all expected methods', () => {
      expect(client).toHaveProperty(
        'getMultiTokenPeriodEnforcerAvailableAmount',
      );
      expect(client).toHaveProperty(
        'getErc20PeriodTransferEnforcerAvailableAmount',
      );
      expect(client).toHaveProperty('getErc20StreamingEnforcerAvailableAmount');
      expect(client).toHaveProperty(
        'getNativeTokenPeriodTransferEnforcerAvailableAmount',
      );
      expect(client).toHaveProperty(
        'getNativeTokenStreamingEnforcerAvailableAmount',
      );
    });

    it('should still have base client methods', () => {
      expect(client).toHaveProperty('getBlockNumber');
      expect(client).toHaveProperty('getBalance');
      expect(client).toHaveProperty('readContract');
    });
  });
});
