import type { UnitOfAuthorityBaseConfig } from './types';
import { createCaveatBuilder } from './coreCaveatBuilder';
import type { CoreCaveatBuilder } from './coreCaveatBuilder';
import { Erc20PeriodTransferBuilderConfig } from './erc20PeriodTransferBuilder';
import { Erc20StreamingBuilderConfig } from './erc20StreamingBuilder';
import { Erc20TransferAmountBuilderConfig } from './erc20TransferAmountBuilder';
import { SpecificActionErc20TransferBatchBuilderConfig } from './specificActionERC20TransferBatchBuilder';

export type Erc20UnitOfAuthorityConfig = UnitOfAuthorityBaseConfig &
  (
    | Erc20StreamingBuilderConfig
    | Erc20TransferAmountBuilderConfig
    | Erc20PeriodTransferBuilderConfig
    | SpecificActionErc20TransferBatchBuilderConfig
  );

/**
 * Creates a caveat builder configured for ERC20 token streaming with value limits.
 *
 * This function creates a caveat builder that includes:
 * - An ERC20 streaming caveat with the specified token parameters
 * - A value limit caveat that restricts the total value to 0 (preventing native token transfers)
 *
 * @param config - Configuration object containing environment and ERC20 streaming parameters.
 * @param config.environment - The DeleGator environment.
 * @param config.tokenAddress - The address of the ERC20 token to stream.
 * @param config.initialAmount - The initial amount of tokens available immediately.
 * @param config.maxAmount - The maximum total amount of tokens that can be streamed.
 * @param config.amountPerSecond - The rate at which allowance increases per second.
 * @param config.startTime - The Unix timestamp when streaming begins.
 * @returns A configured caveat builder with ERC20 streaming and value limit caveats.
 * @throws Error if any of the ERC20 streaming parameters are invalid.
 * @throws Error if the environment is not properly configured.
 */
export function createErc20CaveatBuilder(
  config: Erc20UnitOfAuthorityConfig,
): CoreCaveatBuilder {
  const { environment } = config;

  const caveatBuilder = createCaveatBuilder(environment).addCaveat('valueLte', {
    maxValue: 0n,
  });

  if (isErc20StreamingConfig(config)) {
    caveatBuilder.addCaveat('erc20Streaming', config);
  } else if (isErc20PeriodTransferConfig(config)) {
    caveatBuilder.addCaveat('erc20PeriodTransfer', config);
  } else if (isErc20TransferAmountConfig(config)) {
    caveatBuilder.addCaveat('erc20TransferAmount', config);
  } else if (isSpecificActionErc20TransferBatchConfig(config)) {
    caveatBuilder.addCaveat('specificActionERC20TransferBatch', config);
  } else {
    throw new Error('Invalid ERC20 configuration');
  }

  return caveatBuilder;
}

const isErc20StreamingConfig = (
  config: Erc20UnitOfAuthorityConfig,
): config is Erc20StreamingBuilderConfig & UnitOfAuthorityBaseConfig => {
  return (
    'initialAmount' in config &&
    'maxAmount' in config &&
    'amountPerSecond' in config &&
    'startTime' in config
  );
};

const isErc20TransferAmountConfig = (
  config: Erc20UnitOfAuthorityConfig,
): config is Erc20TransferAmountBuilderConfig & UnitOfAuthorityBaseConfig => {
  return 'tokenAddress' in config && 'maxAmount' in config;
};

const isErc20PeriodTransferConfig = (
  config: Erc20UnitOfAuthorityConfig,
): config is Erc20PeriodTransferBuilderConfig & UnitOfAuthorityBaseConfig => {
  return (
    'tokenAddress' in config &&
    'periodAmount' in config &&
    'periodDuration' in config &&
    'startDate' in config
  );
};

const isSpecificActionErc20TransferBatchConfig = (
  config: Erc20UnitOfAuthorityConfig,
): config is SpecificActionErc20TransferBatchBuilderConfig &
  UnitOfAuthorityBaseConfig => {
  return (
    'tokenAddress' in config &&
    'recipient' in config &&
    'amount' in config &&
    'firstTarget' in config &&
    'firstCalldata' in config
  );
};
