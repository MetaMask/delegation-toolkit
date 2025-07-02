import { expect } from 'chai';
import { concat, toHex } from 'viem';

import { createErc721CaveatBuilder } from '../../src/caveatBuilder/erc721UnitOfAuthority';
import type { Erc721UnitOfAuthorityConfig } from '../../src/caveatBuilder/erc721UnitOfAuthority';
import { randomAddress } from '../utils';
import type { DeleGatorEnvironment } from 'src';

describe('createErc721CaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      ERC721TransferEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates an ERC721 transfer CaveatBuilder', () => {
    const config: Erc721UnitOfAuthorityConfig = {
      environment,
      permittedContract: randomAddress(),
      permittedTokenId: 1n,
    };

    const caveatBuilder = createErc721CaveatBuilder(config);

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
    const config = { environment } as any;

    expect(() => createErc721CaveatBuilder(config)).to.throw(
      'Invalid ERC721 configuration',
    );
  });
});
