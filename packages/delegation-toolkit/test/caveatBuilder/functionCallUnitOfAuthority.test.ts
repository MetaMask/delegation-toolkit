import { expect } from 'chai';
import { createFunctionCallCaveatBuilder } from '../../src/caveatBuilder/functionCallUnitOfAuthority';
import type { FunctionCallUnitOfAuthorityConfig } from '../../src/caveatBuilder/functionCallUnitOfAuthority';
import { randomAddress } from '../utils';
import { DeleGatorEnvironment } from 'src';
import { concat, Hex, toHex } from 'viem';

describe('createFunctionCallCaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      AllowedTargetsEnforcer: randomAddress(),
      AllowedMethodsEnforcer: randomAddress(),
      AllowedCalldataEnforcer: randomAddress(),
      ExactCalldataEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates a Function Call CaveatBuilder', () => {
    const config: FunctionCallUnitOfAuthorityConfig = {
      environment,
      targets: [randomAddress()],
      selectors: ['0x12345678'],
    };

    const caveatBuilder = createFunctionCallCaveatBuilder(config);

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.AllowedTargetsEnforcer,
        args: '0x',
        terms: concat(config.targets),
      },
      {
        enforcer: environment.caveatEnforcers.AllowedMethodsEnforcer,
        args: '0x',
        terms: concat(config.selectors as Hex[]),
      },
    ]);
  });

  it('creates a Function Call CaveatBuilder with allowed calldata', () => {
    const allowedCalldata = { value: '0x12345678', startIndex: 0 } as const;
    const config: FunctionCallUnitOfAuthorityConfig = {
      environment,
      targets: [randomAddress()],
      selectors: ['0x12345678'],
      allowedCalldata: [allowedCalldata],
    };

    const caveatBuilder = createFunctionCallCaveatBuilder(config);

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.AllowedTargetsEnforcer,
        args: '0x',
        terms: concat(config.targets),
      },
      {
        enforcer: environment.caveatEnforcers.AllowedMethodsEnforcer,
        args: '0x',
        terms: concat(config.selectors as Hex[]),
      },
      {
        enforcer: environment.caveatEnforcers.AllowedCalldataEnforcer,
        args: '0x',
        terms: concat([
          toHex(allowedCalldata.startIndex, { size: 32 }),
          allowedCalldata.value,
        ]),
      },
    ]);
  });

  it('creates a Function Call CaveatBuilder with exact calldata', () => {
    const exactCalldata = { calldata: '0x12345678' } as const;
    const config: FunctionCallUnitOfAuthorityConfig = {
      environment,
      targets: [randomAddress()],
      selectors: ['0x12345678'],
      exactCalldata,
    };

    const caveatBuilder = createFunctionCallCaveatBuilder(config);

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.AllowedTargetsEnforcer,
        args: '0x',
        terms: concat(config.targets),
      },
      {
        enforcer: environment.caveatEnforcers.AllowedMethodsEnforcer,
        args: '0x',
        terms: concat(config.selectors as Hex[]),
      },
      {
        enforcer: environment.caveatEnforcers.ExactCalldataEnforcer,
        args: '0x',
        terms: exactCalldata.calldata,
      },
    ]);
  });

  it('throws an error for invalid configuration', () => {
    const config = { environment } as any;

    expect(() => createFunctionCallCaveatBuilder(config)).to.throw(
      'Invalid Function Call configuration',
    );
  });
});
