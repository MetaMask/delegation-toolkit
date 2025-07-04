import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type { Erc721TransferBuilderConfig } from '../erc721TransferBuilder';
import type { DeleGatorEnvironment } from 'src/types';

export type Erc721ScopeBaseConfig = {
  type: 'erc721';
};

export type Erc721ScopeConfig = Erc721ScopeBaseConfig &
  Erc721TransferBuilderConfig;

const isErc721TransferConfig = (
  config: Erc721ScopeBaseConfig,
): config is Erc721TransferBuilderConfig & Erc721ScopeBaseConfig => {
  return 'permittedContract' in config && 'permittedTokenId' in config;
};

/**
 * Creates a caveat builder configured for ERC721 unit of authority.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing permitted contract and token ID.
 * @returns A configured caveat builder with the specified caveats.
 * @throws Error if any of the required parameters are invalid.
 */
export function createErc721CaveatBuilder(
  environment: DeleGatorEnvironment,
  config: Erc721ScopeConfig,
): CoreCaveatBuilder {
  if (!isErc721TransferConfig(config)) {
    throw new Error('Invalid ERC721 configuration');
  }

  const caveatBuilder = createCaveatBuilder(environment).addCaveat(
    'erc721Transfer',
    config,
  );

  return caveatBuilder;
}
