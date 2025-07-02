import { expect } from 'chai';
import { concat, toHex } from 'viem';

import { createNativeTokenCaveatBuilder } from '../../src/caveatBuilder/nativeTokenUnitOfAuthority';
import type { NativeTokenUnitOfAuthorityConfig } from '../../src/caveatBuilder/nativeTokenUnitOfAuthority';
import { randomAddress } from '../utils';
import type { DeleGatorEnvironment } from 'src';

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
    const config: NativeTokenUnitOfAuthorityConfig = {
      environment,
      initialAmount: 1000n,
      maxAmount: 10000n,
      amountPerSecond: 1n,
      startTime: Math.floor(Date.now() / 1000),
    };

    const caveatBuilder = createNativeTokenCaveatBuilder(config);

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
    const config: NativeTokenUnitOfAuthorityConfig = {
      environment,
      periodAmount: 1000n,
      periodDuration: 1000,
      startDate: Math.floor(Date.now() / 1000),
    };

    const caveatBuilder = createNativeTokenCaveatBuilder(config);

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
    const config: NativeTokenUnitOfAuthorityConfig = {
      environment,
      maxAmount: 10000n,
    };

    const caveatBuilder = createNativeTokenCaveatBuilder(config);

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
    const config = { environment } as any;

    expect(() => createNativeTokenCaveatBuilder(config)).to.throw(
      'Invalid native token configuration',
    );
  });
});
