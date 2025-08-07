import { hasProperties } from '../../utils';
import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type { NativeTokenPeriodTransferBuilderConfig } from '../nativeTokenPeriodTransferBuilder';
import type { NativeTokenStreamingBuilderConfig } from '../nativeTokenStreamingBuilder';
import type { NativeTokenTransferAmountBuilderConfig } from '../nativeTokenTransferAmountBuilder';
import type { DeleGatorEnvironment } from 'src/types';

type NativeTokenScopeBaseConfig = {
  type: 'nativeToken';
};

export type NativeTokenScopeConfig = NativeTokenScopeBaseConfig &
  (
    | NativeTokenStreamingBuilderConfig
    | NativeTokenTransferAmountBuilderConfig
    | NativeTokenPeriodTransferBuilderConfig
  );

const isNativeTokenStreamingConfig = (
  config: NativeTokenScopeConfig,
): config is NativeTokenStreamingBuilderConfig & NativeTokenScopeBaseConfig => {
  return hasProperties(
    config as NativeTokenStreamingBuilderConfig & NativeTokenScopeBaseConfig,
    ['initialAmount', 'maxAmount', 'amountPerSecond', 'startTime'],
  );
};

const isNativeTokenTransferAmountConfig = (
  config: NativeTokenScopeConfig,
): config is NativeTokenTransferAmountBuilderConfig &
  NativeTokenScopeBaseConfig => {
  return hasProperties(
    config as NativeTokenTransferAmountBuilderConfig &
      NativeTokenScopeBaseConfig,
    ['maxAmount'],
  );
};

const isNativeTokenPeriodTransferConfig = (
  config: NativeTokenScopeConfig,
): config is NativeTokenPeriodTransferBuilderConfig &
  NativeTokenScopeBaseConfig => {
  return hasProperties(
    config as NativeTokenPeriodTransferBuilderConfig &
      NativeTokenScopeBaseConfig,
    ['periodAmount', 'periodDuration', 'startDate'],
  );
};

/**
 * Creates a caveat builder configured for native token streaming with value limits.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing native token streaming parameters.
 * @returns A configured caveat builder with native token streaming and value limit caveats.
 * @throws Error if any of the native token streaming parameters are invalid.
 * @throws Error if the environment is not properly configured.
 */
export function createNativeTokenCaveatBuilder(
  environment: DeleGatorEnvironment,
  config: NativeTokenScopeConfig,
): CoreCaveatBuilder {
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
