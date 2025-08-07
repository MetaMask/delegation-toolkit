import { concat, toHex } from 'viem';
import { describe, it, expect } from 'vitest';

import { createNativeTokenPeriodicCaveatBuilder } from '../../../src/caveatBuilder/scope/nativeTokenPeriodicScope';
import type { NativeTokenPeriodicScopeConfig } from '../../../src/caveatBuilder/scope/nativeTokenPeriodicScope';
import type { DeleGatorEnvironment } from '../../../src/types';
import { randomAddress } from '../../utils';

describe('createNativeTokenPeriodicCaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      ExactCalldataEnforcer: randomAddress(),
      NativeTokenPeriodTransferEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates a native token periodic transfer CaveatBuilder', () => {
    const config: NativeTokenPeriodicScopeConfig = {
      type: 'nativeToken-periodic',
      periodAmount: 1000n,
      periodDuration: 1000,
      startDate: Math.floor(Date.now() / 1000),
    };

    const caveatBuilder = createNativeTokenPeriodicCaveatBuilder(
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
        enforcer: environment.caveatEnforcers.NativeTokenPeriodTransferEnforcer,
        args: '0x',
        terms: concat([
          toHex(config.periodAmount, { size: 32 }),
          toHex(config.periodDuration, { size: 32 }),
          toHex(config.startDate, { size: 32 }),
        ]),
      },
    ]);
  });
});
