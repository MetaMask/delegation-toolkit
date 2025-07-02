import { createCaveatBuilder } from './coreCaveatBuilder';
import type { CoreCaveatBuilder } from './coreCaveatBuilder';
import type { Erc721TransferBuilderConfig } from './erc721TransferBuilder';
import type { UnitOfAuthorityBaseConfig } from './types';

export type Erc721UnitOfAuthorityConfig = UnitOfAuthorityBaseConfig &
  Erc721TransferBuilderConfig;

/**
 * Creates a caveat builder configured for ERC721 unit of authority.
 *
 * This function creates a caveat builder that includes:
 * - ERC721 transfer caveat
 *
 * @param config - Configuration object containing permitted contract and token ID.
 * @param config.environment - The DeleGator environment.
 * @returns A configured caveat builder with the specified caveats.
 * @throws Error if any of the required parameters are invalid.
 */
export function createErc721CaveatBuilder(
  config: Erc721UnitOfAuthorityConfig,
): CoreCaveatBuilder {
  if (!isErc721TransferConfig(config)) {
    throw new Error('Invalid ERC721 configuration');
  }

  const caveatBuilder = createCaveatBuilder(config.environment).addCaveat(
    'erc721Transfer',
    config,
  );

  return caveatBuilder;
}

const isErc721TransferConfig = (
  config: Erc721UnitOfAuthorityConfig,
): config is Erc721UnitOfAuthorityConfig => {
  return 'permittedContract' in config && 'permittedTokenId' in config;
};
