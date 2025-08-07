import { concat, toHex } from 'viem';
import { describe, it, expect } from 'vitest';

import { createErc20PeriodicCaveatBuilder } from '../../../src/caveatBuilder/scope/erc20PeriodicScope';
import type { Erc20PeriodicScopeConfig } from '../../../src/caveatBuilder/scope/erc20PeriodicScope';
import type { DeleGatorEnvironment } from '../../../src/types';
import { randomAddress } from '../../utils';

describe('createErc20PeriodicCaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      ValueLteEnforcer: randomAddress(),
      ERC20PeriodTransferEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates an ERC20 periodic transfer CaveatBuilder', () => {
    const config: Erc20PeriodicScopeConfig = {
      type: 'erc20-periodic',
      tokenAddress: randomAddress(),
      periodAmount: 1000n,
      periodDuration: 1000,
      startDate: Math.floor(Date.now() / 1000),
    };

    const caveatBuilder = createErc20PeriodicCaveatBuilder(environment, config);

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.ValueLteEnforcer,
        args: '0x',
        terms:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        enforcer: environment.caveatEnforcers.ERC20PeriodTransferEnforcer,
        args: '0x',
        terms: concat([
          config.tokenAddress,
          toHex(config.periodAmount, { size: 32 }),
          toHex(config.periodDuration, { size: 32 }),
          toHex(config.startDate, { size: 32 }),
        ]),
      },
    ]);
  });
});
