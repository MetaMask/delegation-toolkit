import { createCaveatBuilder } from './coreCaveatBuilder';
import type { CoreCaveatBuilder } from './coreCaveatBuilder';
import type { NativeTokenPeriodTransferBuilderConfig } from './nativeTokenPeriodTransferBuilder';
import type { NativeTokenStreamingBuilderConfig } from './nativeTokenStreamingBuilder';
import type { NativeTokenTransferAmountBuilderConfig } from './nativeTokenTransferAmountBuilder';
import type { UnitOfAuthorityBaseConfig } from './types';

export type NativeTokenUnitOfAuthorityConfig = UnitOfAuthorityBaseConfig &
  (
    | NativeTokenStreamingBuilderConfig
    | NativeTokenTransferAmountBuilderConfig
    | NativeTokenPeriodTransferBuilderConfig
  );

const isNativeTokenStreamingConfig = (
  config: NativeTokenUnitOfAuthorityConfig,
): config is NativeTokenStreamingBuilderConfig & UnitOfAuthorityBaseConfig => {
  return (
    'initialAmount' in config &&
    'maxAmount' in config &&
    'amountPerSecond' in config &&
    'startTime' in config
  );
};

const isNativeTokenTransferAmountConfig = (
  config: NativeTokenUnitOfAuthorityConfig,
): config is NativeTokenTransferAmountBuilderConfig &
  UnitOfAuthorityBaseConfig => {
  return 'maxAmount' in config;
};

const isNativeTokenPeriodTransferConfig = (
  config: NativeTokenUnitOfAuthorityConfig,
): config is NativeTokenPeriodTransferBuilderConfig &
  UnitOfAuthorityBaseConfig => {
  return (
    'periodAmount' in config &&
    'periodDuration' in config &&
    'startDate' in config
  );
};

/**
 * Creates a caveat builder configured for native token streaming with value limits.
 *
 * @param config - Configuration object containing environment and native token streaming parameters.
 * @param config.environment - The DeleGator environment.
 * @param config.tokenAddress - The address of the native token to stream.
 * @param config.initialAmount - The initial amount of tokens available immediately.
 * @param config.maxAmount - The maximum total amount of tokens that can be streamed.
 * @param config.amountPerSecond - The rate at which allowance increases per second.
 * @param config.startTime - The Unix timestamp when streaming begins.
 * @returns A configured caveat builder with native token streaming and value limit caveats.
 * @throws Error if any of the native token streaming parameters are invalid.
 * @throws Error if the environment is not properly configured.
 */
export function createNativeTokenCaveatBuilder(
  config: NativeTokenUnitOfAuthorityConfig,
): CoreCaveatBuilder {
  const { environment } = config;

  const caveatBuilder = createCaveatBuilder(environment).addCaveat(
    'exactCalldata',
    {
      calldata: '0x',
    },
  );

  if (isNativeTokenStreamingConfig(config)) {
    caveatBuilder.addCaveat('nativeTokenStreaming', config);
  } else if (isNativeTokenPeriodTransferConfig(config)) {
    caveatBuilder.addCaveat('nativeTokenPeriodTransfer', config);
  } else if (isNativeTokenTransferAmountConfig(config)) {
    caveatBuilder.addCaveat('nativeTokenTransferAmount', config);
  } else {
    throw new Error('Invalid native token configuration');
  }

  return caveatBuilder;
}
