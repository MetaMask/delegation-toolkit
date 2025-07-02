import type { DeleGatorEnvironment } from '../types';
import { createCaveatBuilder } from './coreCaveatBuilder';
import type { CoreCaveatBuilder } from './coreCaveatBuilder';
import type { OwnershipTransferBuilderConfig } from './ownershipTransferBuilder';

export type OwnershipUnitOfAuthorityConfig = OwnershipTransferBuilderConfig;

const isOwnershipTransferConfig = (
  config: OwnershipUnitOfAuthorityConfig,
): config is OwnershipTransferBuilderConfig => {
  return 'targetContract' in config;
};

/**
 * Creates a caveat builder configured for ownership transfer unit of authority.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing the target contract.
 * @param config.environment - The DeleGator environment.
 * @returns A configured caveat builder with the specified caveats.
 * @throws Error if any of the required parameters are invalid.
 */
export function createOwnershipTransferCaveatBuilder(
  environment: DeleGatorEnvironment,
  config: OwnershipUnitOfAuthorityConfig,
): CoreCaveatBuilder {
  if (!isOwnershipTransferConfig(config)) {
    throw new Error('Invalid ownership transfer configuration');
  }

  const caveatBuilder = createCaveatBuilder(environment).addCaveat(
    'ownershipTransfer',
    config,
  );

  return caveatBuilder;
}
