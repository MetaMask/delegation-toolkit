import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type { NativeTokenTransferAmountBuilderConfig } from '../nativeTokenTransferAmountBuilder';
import type { DeleGatorEnvironment } from 'src/types';

export type NativeTokenTransferScopeConfig = {
  type: 'nativeToken-transfer';
} & NativeTokenTransferAmountBuilderConfig;

/**
 * Creates a caveat builder configured for native token transfers with amount limits.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing native token transfer parameters.
 * @returns A configured caveat builder with native token transfer amount and exact calldata caveats.
 * @throws Error if any of the native token transfer parameters are invalid.
 * @throws Error if the environment is not properly configured.
 */
export function createNativeTokenTransferCaveatBuilder(
  environment: DeleGatorEnvironment,
  config: NativeTokenTransferScopeConfig,
): CoreCaveatBuilder {
  return createCaveatBuilder(environment)
    .addCaveat('exactCalldata', {
      calldata: '0x',
    })
    .addCaveat('nativeTokenTransferAmount', {
      maxAmount: config.maxAmount,
    });
}
