import { expect } from 'chai';
import { concat, toHex } from 'viem';

import { createErc721CaveatBuilder } from '../../../src/caveatBuilder/scope/erc721Scope';
import type { Erc721ScopeConfig } from '../../../src/caveatBuilder/scope/erc721Scope';
import type { DeleGatorEnvironment } from '../../../src/types';
import { randomAddress } from '../../utils';

describe('createErc721CaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      ERC721TransferEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates an ERC721 transfer CaveatBuilder', () => {
    const config: Erc721ScopeConfig = {
      type: 'erc721',
      permittedContract: randomAddress(),
      permittedTokenId: 1n,
    };

    const caveatBuilder = createErc721CaveatBuilder(environment, config);

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.ERC721TransferEnforcer,
        args: '0x',
        terms: concat([
          config.permittedContract,
          toHex(config.permittedTokenId, { size: 32 }),
        ]),
      },
    ]);
  });

  it('throws an error for invalid configuration', () => {
    const config = { type: 'erc721' } as unknown as Erc721ScopeConfig;

    expect(() => createErc721CaveatBuilder(environment, config)).to.throw(
      'Invalid ERC721 configuration',
    );
  });
});
