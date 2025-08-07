import type { DeleGatorEnvironment } from '../../types';
import { hasProperties } from '../../utils';
import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type { OwnershipTransferBuilderConfig } from '../ownershipTransferBuilder';

type OwnershipScopeBaseConfig = {
  type: 'ownership';
};

export type OwnershipScopeConfig = OwnershipScopeBaseConfig &
  OwnershipTransferBuilderConfig;

const isOwnershipTransferConfig = (
  config: OwnershipScopeConfig,
): config is OwnershipTransferBuilderConfig & OwnershipScopeBaseConfig => {
  return hasProperties(
    config as OwnershipTransferBuilderConfig & OwnershipScopeBaseConfig,
    ['contractAddress'],
  );
};

/**
 * Creates a caveat builder configured for ownership transfer unit of authority.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing the target contract.
 * @returns A configured caveat builder with the specified caveats.
 * @throws Error if any of the required parameters are invalid.
 */
export function createOwnershipCaveatBuilder(
  environment: DeleGatorEnvironment,
  config: OwnershipScopeConfig,
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
