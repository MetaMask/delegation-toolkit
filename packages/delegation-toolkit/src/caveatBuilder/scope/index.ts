import { type Erc20ScopeConfig, createErc20CaveatBuilder } from './erc20Scope';
import {
  type Erc721ScopeConfig,
  createErc721CaveatBuilder,
} from './erc721Scope';
import {
  createFunctionCallCaveatBuilder,
  type FunctionCallScopeConfig,
} from './functionCallScope';
import {
  createNativeTokenCaveatBuilder,
  type NativeTokenScopeConfig,
} from './nativeTokenScope';
import {
  createOwnershipCaveatBuilder,
  type OwnershipScopeConfig,
} from './ownershipScope';
import type { DeleGatorEnvironment } from '../../types';

export type ScopeConfig =
  | Erc20ScopeConfig
  | Erc721ScopeConfig
  | NativeTokenScopeConfig
  | OwnershipScopeConfig
  | FunctionCallScopeConfig;

export const createCaveatBuilderFromScope = (
  environment: DeleGatorEnvironment,
  scopeConfig: ScopeConfig,
) => {
  switch (scopeConfig.type) {
    case 'erc20':
      return createErc20CaveatBuilder(
        environment,
        scopeConfig as Erc20ScopeConfig,
      );
    case 'erc721':
      return createErc721CaveatBuilder(environment, scopeConfig);
    case 'nativeToken':
      return createNativeTokenCaveatBuilder(environment, scopeConfig);
    case 'ownership':
      return createOwnershipCaveatBuilder(environment, scopeConfig);
    case 'functionCall':
      return createFunctionCallCaveatBuilder(environment, scopeConfig);
    default:
      // eslint-disable-next-line no-case-declarations
      const exhaustivenessCheck: never = scopeConfig;
      throw new Error(
        `Invalid scope type: ${(exhaustivenessCheck as { type: string }).type}`,
      );
  }
};
