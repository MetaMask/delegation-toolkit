import { toHex } from 'viem';
import { describe, it, expect } from 'vitest';

import { createNativeTokenTransferCaveatBuilder } from '../../../src/caveatBuilder/scope/nativeTokenTransferScope';
import type { NativeTokenTransferScopeConfig } from '../../../src/caveatBuilder/scope/nativeTokenTransferScope';
import type { DeleGatorEnvironment } from '../../../src/types';
import { randomAddress } from '../../utils';

describe('createNativeTokenTransferCaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      ExactCalldataEnforcer: randomAddress(),
      NativeTokenTransferAmountEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates a native token transfer CaveatBuilder', () => {
    const config: NativeTokenTransferScopeConfig = {
      type: 'nativeToken-transfer',
      maxAmount: 1000n,
    };

    const caveatBuilder = createNativeTokenTransferCaveatBuilder(
      environment,
      config,
    );

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.ExactCalldataEnforcer,
        args: '0x',
        terms: '0x',
      },
      {
        enforcer: environment.caveatEnforcers.NativeTokenTransferAmountEnforcer,
        args: '0x',
        terms: toHex(config.maxAmount, { size: 32 }),
      },
    ]);
  });
});
