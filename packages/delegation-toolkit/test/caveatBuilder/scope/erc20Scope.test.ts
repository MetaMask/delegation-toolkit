import { expect } from 'chai';
import { concat, toHex } from 'viem';

import { createErc20CaveatBuilder } from '../../../src/caveatBuilder/scope/erc20Scope';
import type { Erc20ScopeConfig } from '../../../src/caveatBuilder/scope/erc20Scope';
import type { DeleGatorEnvironment } from '../../../src/types';
import { randomAddress } from '../../utils';

describe('createErc20CaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      ValueLteEnforcer: randomAddress(),
      ERC20StreamingEnforcer: randomAddress(),
      ERC20PeriodTransferEnforcer: randomAddress(),
      ERC20TransferAmountEnforcer: randomAddress(),
      SpecificActionERC20TransferBatchEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates an ERC20 streaming CaveatBuilder', () => {
    const config: Erc20ScopeConfig = {
      type: 'erc20',
      tokenAddress: randomAddress(),
      initialAmount: 1000n,
      maxAmount: 10000n,
      amountPerSecond: 1n,
      startTime: Math.floor(Date.now() / 1000),
    };

    const caveatBuilder = createErc20CaveatBuilder(environment, config);

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.ValueLteEnforcer,
        args: '0x',
        terms:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        enforcer: environment.caveatEnforcers.ERC20StreamingEnforcer,
        args: '0x',
        terms: concat([
          config.tokenAddress,
          toHex(config.initialAmount, { size: 32 }),
          toHex(config.maxAmount, { size: 32 }),
          toHex(config.amountPerSecond, { size: 32 }),
          toHex(config.startTime, { size: 32 }),
        ]),
      },
    ]);
  });

  it('creates an ERC20 period transfer CaveatBuilder', () => {
    const config: Erc20ScopeConfig = {
      type: 'erc20',
      tokenAddress: randomAddress(),
      periodAmount: 1000n,
      periodDuration: 1000,
      startDate: Math.floor(Date.now() / 1000),
    };

    const caveatBuilder = createErc20CaveatBuilder(environment, config);

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

  it('creates an ERC20 transfer amount CaveatBuilder', () => {
    const config: Erc20ScopeConfig = {
      type: 'erc20',
      tokenAddress: randomAddress(),
      maxAmount: 1000n,
    };

    const caveatBuilder = createErc20CaveatBuilder(environment, config);

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.ValueLteEnforcer,
        args: '0x',
        terms:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        enforcer: environment.caveatEnforcers.ERC20TransferAmountEnforcer,
        args: '0x',
        terms: concat([
          config.tokenAddress,
          toHex(config.maxAmount, { size: 32 }),
        ]),
      },
    ]);
  });

  it('creates a specific action ERC20 transfer batch CaveatBuilder', () => {
    const config: Erc20ScopeConfig = {
      type: 'erc20',
      tokenAddress: randomAddress(),
      recipient: randomAddress(),
      amount: 1000n,
      firstTarget: randomAddress(),
      firstCalldata: '0x',
    };

    const caveatBuilder = createErc20CaveatBuilder(environment, config);

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.ValueLteEnforcer,
        args: '0x',
        terms:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        enforcer:
          environment.caveatEnforcers.SpecificActionERC20TransferBatchEnforcer,
        args: '0x',
        terms: concat([
          config.tokenAddress,
          config.recipient,
          toHex(config.amount, { size: 32 }),
          config.firstTarget,
          config.firstCalldata,
        ]),
      },
    ]);
  });

  it('throws an error for invalid configuration', () => {
    const config = { type: 'erc20' } as unknown as Erc20ScopeConfig;

    expect(() => createErc20CaveatBuilder(environment, config)).to.throw(
      'Invalid ERC20 configuration',
    );
  });
});
