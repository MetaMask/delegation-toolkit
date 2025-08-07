import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type { Erc20StreamingBuilderConfig } from '../erc20StreamingBuilder';
import type { DeleGatorEnvironment } from 'src/types';

export type Erc20StreamingScopeConfig = {
  type: 'erc20-streaming';
} & Erc20StreamingBuilderConfig;

/**
 * Creates a caveat builder configured for ERC20 token streaming with time-based limits.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing ERC20 streaming parameters.
 * @returns A configured caveat builder with ERC20 streaming and value limit caveats.
 * @throws Error if any of the ERC20 streaming parameters are invalid.
 * @throws Error if the environment is not properly configured.
 */
export function createErc20StreamingCaveatBuilder(
  environment: DeleGatorEnvironment,
  config: Erc20StreamingScopeConfig,
): CoreCaveatBuilder {
  return createCaveatBuilder(environment)
    .addCaveat('valueLte', {
      maxValue: 0n,
    })
    .addCaveat('erc20Streaming', {
      tokenAddress: config.tokenAddress,
      initialAmount: config.initialAmount,
      maxAmount: config.maxAmount,
      amountPerSecond: config.amountPerSecond,
      startTime: config.startTime,
    });
}
