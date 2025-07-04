import { expect } from 'chai';
import { concat, toHex } from 'viem';

import { createNativeTokenCaveatBuilder } from '../../../src/caveatBuilder/scope/nativeTokenScope';
import type { NativeTokenScopeConfig } from '../../../src/caveatBuilder/scope/nativeTokenScope';
import type { DeleGatorEnvironment } from '../../../src/types';
import { randomAddress } from '../../utils';

describe('createNativeTokenCaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      NativeTokenStreamingEnforcer: randomAddress(),
      NativeTokenPeriodTransferEnforcer: randomAddress(),
      NativeTokenTransferAmountEnforcer: randomAddress(),
      ExactCalldataEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates a Native Token Streaming CaveatBuilder', () => {
    const config: NativeTokenScopeConfig = {
      type: 'nativeToken',
      initialAmount: 1000n,
      maxAmount: 10000n,
      amountPerSecond: 1n,
      startTime: Math.floor(Date.now() / 1000),
    };

    const caveatBuilder = createNativeTokenCaveatBuilder(environment, config);

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

  it('creates a Native Token Period Transfer CaveatBuilder', () => {
    const config: NativeTokenScopeConfig = {
      type: 'nativeToken',
      periodAmount: 1000n,
      periodDuration: 1000,
      startDate: Math.floor(Date.now() / 1000),
    };

    const caveatBuilder = createNativeTokenCaveatBuilder(environment, config);

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

  it('creates a Native Token Transfer Amount CaveatBuilder', () => {
    const config: NativeTokenScopeConfig = {
      type: 'nativeToken',
      maxAmount: 10000n,
    };

    const caveatBuilder = createNativeTokenCaveatBuilder(environment, config);

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

  it('throws an error for invalid configuration', () => {
    const config = { type: 'nativeToken' } as unknown as NativeTokenScopeConfig;

    expect(() => createNativeTokenCaveatBuilder(environment, config)).to.throw(
      'Invalid native token configuration',
    );
  });
});
