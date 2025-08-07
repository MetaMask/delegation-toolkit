import { concat, toHex } from 'viem';
import { describe, it, expect } from 'vitest';

import { createNativeTokenStreamingCaveatBuilder } from '../../../src/caveatBuilder/scope/nativeTokenStreamingScope';
import type { NativeTokenStreamingScopeConfig } from '../../../src/caveatBuilder/scope/nativeTokenStreamingScope';
import type { DeleGatorEnvironment } from '../../../src/types';
import { randomAddress } from '../../utils';

describe('createNativeTokenStreamingCaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      ExactCalldataEnforcer: randomAddress(),
      NativeTokenStreamingEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates a native token streaming CaveatBuilder', () => {
    const config: NativeTokenStreamingScopeConfig = {
      type: 'nativeToken-streaming',
      initialAmount: 1000n,
      maxAmount: 10000n,
      amountPerSecond: 1n,
      startTime: Math.floor(Date.now() / 1000),
    };

    const caveatBuilder = createNativeTokenStreamingCaveatBuilder(
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
        enforcer: environment.caveatEnforcers.NativeTokenStreamingEnforcer,
        args: '0x',
        terms: concat([
          toHex(config.initialAmount, { size: 32 }),
          toHex(config.maxAmount, { size: 32 }),
          toHex(config.amountPerSecond, { size: 32 }),
          toHex(config.startTime, { size: 32 }),
        ]),
      },
    ]);
  });
});
