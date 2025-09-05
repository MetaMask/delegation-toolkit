import type { DeleGatorEnvironment } from '../../types';
import { hasProperties } from '../../utils';
import type { AllowedCalldataBuilderConfig } from '../allowedCalldataBuilder';
import type { AllowedMethodsBuilderConfig } from '../allowedMethodsBuilder';
import type { AllowedTargetsBuilderConfig } from '../allowedTargetsBuilder';
import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type { ExactCalldataBuilderConfig } from '../exactCalldataBuilder';

type FunctionCallScopeBaseConfig = {
  type: 'functionCall';
};

export type FunctionCallScopeConfig = FunctionCallScopeBaseConfig &
  AllowedTargetsBuilderConfig &
  AllowedMethodsBuilderConfig & {
    allowedCalldata?: AllowedCalldataBuilderConfig[];
    exactCalldata?: ExactCalldataBuilderConfig;
  };

const isFunctionCallConfig = (
  config: FunctionCallScopeConfig,
): config is FunctionCallScopeConfig => {
  return hasProperties(config, ['targets', 'selectors']);
};

/**
 * Creates a caveat builder configured for function call unit of authority.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing allowed targets, methods, and optionally calldata.
 * @returns A configured caveat builder with the specified caveats.
 * @throws Error if any of the required parameters are invalid.
 * @throws Error if both allowedCalldata and exactCalldata are provided simultaneously.
 */
export function createFunctionCallCaveatBuilder(
  environment: DeleGatorEnvironment,
  config: FunctionCallScopeConfig,
): CoreCaveatBuilder {
  const { targets, selectors, allowedCalldata, exactCalldata } = config;

  if (!isFunctionCallConfig(config)) {
    throw new Error('Invalid Function Call configuration');
  }

  if (allowedCalldata && allowedCalldata.length > 0 && exactCalldata) {
    throw new Error(
      'Cannot specify both allowedCalldata and exactCalldata. Please use only one calldata restriction type.',
    );
  }

  const caveatBuilder = createCaveatBuilder(environment)
    .addCaveat('allowedTargets', { targets })
    .addCaveat('allowedMethods', { selectors });

  if (allowedCalldata && allowedCalldata.length > 0) {
    allowedCalldata.forEach((calldataConfig) => {
      caveatBuilder.addCaveat('allowedCalldata', calldataConfig);
    });
  } else if (exactCalldata) {
    caveatBuilder.addCaveat('exactCalldata', exactCalldata);
  }

  return caveatBuilder;
}
