import { hasProperties } from '../../utils';
import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type { Erc20PeriodTransferBuilderConfig } from '../erc20PeriodTransferBuilder';
import type { Erc20StreamingBuilderConfig } from '../erc20StreamingBuilder';
import type { Erc20TransferAmountBuilderConfig } from '../erc20TransferAmountBuilder';
import type { SpecificActionErc20TransferBatchBuilderConfig } from '../specificActionERC20TransferBatchBuilder';
import type { DeleGatorEnvironment } from 'src/types';

type Erc20ScopeBaseConfig = {
  type: 'erc20';
};

const isErc20StreamingConfig = (
  config: Erc20ScopeBaseConfig,
): config is Erc20StreamingBuilderConfig & Erc20ScopeBaseConfig => {
  return hasProperties(
    config as Erc20StreamingBuilderConfig & Erc20ScopeBaseConfig,
    ['initialAmount', 'maxAmount', 'amountPerSecond', 'startTime'],
  );
};

const isErc20TransferAmountConfig = (
  config: Erc20ScopeBaseConfig,
): config is Erc20TransferAmountBuilderConfig & Erc20ScopeBaseConfig => {
  return hasProperties(
    config as Erc20TransferAmountBuilderConfig & Erc20ScopeBaseConfig,
    ['tokenAddress', 'maxAmount'],
  );
};

const isErc20PeriodTransferConfig = (
  config: Erc20ScopeBaseConfig,
): config is Erc20PeriodTransferBuilderConfig & Erc20ScopeBaseConfig => {
  return hasProperties(
    config as Erc20PeriodTransferBuilderConfig & Erc20ScopeBaseConfig,
    ['tokenAddress', 'periodAmount', 'periodDuration', 'startDate'],
  );
};

const isSpecificActionErc20TransferBatchConfig = (
  config: Erc20ScopeBaseConfig,
): config is SpecificActionErc20TransferBatchBuilderConfig &
  Erc20ScopeBaseConfig => {
  return hasProperties(
    config as SpecificActionErc20TransferBatchBuilderConfig &
      Erc20ScopeBaseConfig,
    ['tokenAddress', 'recipient', 'amount', 'target', 'calldata'],
  );
};

export type Erc20ScopeConfig = Erc20ScopeBaseConfig &
  (
    | Erc20StreamingBuilderConfig
    | Erc20TransferAmountBuilderConfig
    | Erc20PeriodTransferBuilderConfig
    | SpecificActionErc20TransferBatchBuilderConfig
  );

/**
 * Creates a caveat builder configured for ERC20 token streaming with value limits.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing ERC20 streaming parameters.
 * @returns A configured caveat builder with ERC20 streaming and value limit caveats.
 * @throws Error if any of the ERC20 streaming parameters are invalid.
 * @throws Error if the environment is not properly configured.
 */
export function createErc20CaveatBuilder(
  environment: DeleGatorEnvironment,
  config: Erc20ScopeConfig,
): CoreCaveatBuilder {
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
