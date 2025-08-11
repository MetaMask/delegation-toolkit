import { concat, toHex } from 'viem';
import { describe, it, expect } from 'vitest';

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
      type: 'erc721Transfer',
      tokenAddress: randomAddress(),
      tokenId: 1n,
    };

    const caveatBuilder = createErc721CaveatBuilder(environment, config);

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.ERC721TransferEnforcer,
        args: '0x',
        terms: concat([
          config.tokenAddress,
          toHex(config.tokenId, { size: 32 }),
        ]),
      },
    ]);
  });

  it('throws an error for invalid configuration', () => {
    const config = { type: 'erc721Transfer' } as unknown as Erc721ScopeConfig;

    expect(() => createErc721CaveatBuilder(environment, config)).to.throw(
      'Invalid ERC721 configuration',
    );
  });
});
