import {
  type Erc20PeriodicScopeConfig,
  createErc20PeriodicCaveatBuilder,
} from './erc20PeriodicScope';
import {
  type Erc20StreamingScopeConfig,
  createErc20StreamingCaveatBuilder,
} from './erc20StreamingScope';
import {
  type Erc20TransferScopeConfig,
  createErc20TransferCaveatBuilder,
} from './erc20TransferScope';
import {
  type Erc721ScopeConfig,
  createErc721CaveatBuilder,
} from './erc721Scope';
import {
  createFunctionCallCaveatBuilder,
  type FunctionCallScopeConfig,
} from './functionCallScope';
import {
  type NativeTokenPeriodicScopeConfig,
  createNativeTokenPeriodicCaveatBuilder,
} from './nativeTokenPeriodicScope';
import {
  type NativeTokenStreamingScopeConfig,
  createNativeTokenStreamingCaveatBuilder,
} from './nativeTokenStreamingScope';
import {
  type NativeTokenTransferScopeConfig,
  createNativeTokenTransferCaveatBuilder,
} from './nativeTokenTransferScope';
import {
  createOwnershipCaveatBuilder,
  type OwnershipScopeConfig,
} from './ownershipScope';
import type { SmartAccountsEnvironment } from '../../types';
// Import caveat builder name constants
import { erc20PeriodTransfer } from '../erc20PeriodTransferBuilder';
import { erc20Streaming } from '../erc20StreamingBuilder';
import { erc20TransferAmount } from '../erc20TransferAmountBuilder';
import { erc721Transfer } from '../erc721TransferBuilder';
import { nativeTokenPeriodTransfer } from '../nativeTokenPeriodTransferBuilder';
import { nativeTokenStreaming } from '../nativeTokenStreamingBuilder';
import { nativeTokenTransferAmount } from '../nativeTokenTransferAmountBuilder';
import { ownershipTransfer } from '../ownershipTransferBuilder';

export type ScopeConfig =
  | Erc20TransferScopeConfig
  | Erc20StreamingScopeConfig
  | Erc20PeriodicScopeConfig
  | NativeTokenTransferScopeConfig
  | NativeTokenStreamingScopeConfig
  | NativeTokenPeriodicScopeConfig
  | Erc721ScopeConfig
  | OwnershipScopeConfig
  | FunctionCallScopeConfig;

export const createCaveatBuilderFromScope = (
  environment: SmartAccountsEnvironment,
  scopeConfig: ScopeConfig,
) => {
  switch (scopeConfig.type) {
    case erc20TransferAmount:
      return createErc20TransferCaveatBuilder(environment, scopeConfig);
    case erc20Streaming:
      return createErc20StreamingCaveatBuilder(environment, scopeConfig);
    case erc20PeriodTransfer:
      return createErc20PeriodicCaveatBuilder(environment, scopeConfig);
    case nativeTokenTransferAmount:
      return createNativeTokenTransferCaveatBuilder(environment, scopeConfig);
    case nativeTokenStreaming:
      return createNativeTokenStreamingCaveatBuilder(environment, scopeConfig);
    case nativeTokenPeriodTransfer:
      return createNativeTokenPeriodicCaveatBuilder(environment, scopeConfig);
    case erc721Transfer:
      return createErc721CaveatBuilder(environment, scopeConfig);
    case ownershipTransfer:
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
