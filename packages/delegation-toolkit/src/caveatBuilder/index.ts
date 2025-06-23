import type { DeleGatorEnvironment } from '../types';
import {
  allowedCalldata,
  allowedCalldataBuilder,
} from './allowedCalldataBuilder';
import { allowedMethods, allowedMethodsBuilder } from './allowedMethodsBuilder';
import { allowedTargets, allowedTargetsBuilder } from './allowedTargetsBuilder';
import {
  argsEqualityCheck,
  argsEqualityCheckBuilder,
} from './argsEqualityCheckBuilder';
import { blockNumber, blockNumberBuilder } from './blockNumberBuilder';
import type { CaveatBuilderConfig } from './caveatBuilder';
import { CaveatBuilder } from './caveatBuilder';
import { deployed, deployedBuilder } from './deployedBuilder';
import {
  erc1155BalanceChange,
  erc1155BalanceChangeBuilder,
} from './erc1155BalanceChangeBuilder';
import {
  erc20BalanceChange,
  erc20BalanceChangeBuilder,
} from './erc20BalanceChangeBuilder';
import {
  erc20PeriodTransfer,
  erc20PeriodTransferBuilder,
} from './erc20PeriodTransferBuilder';
import { erc20Streaming, erc20StreamingBuilder } from './erc20StreamingBuilder';
import {
  erc20TransferAmount,
  erc20TransferAmountBuilder,
} from './erc20TransferAmountBuilder';
import {
  erc721BalanceChange,
  erc721BalanceChangeBuilder,
} from './erc721BalanceChangeBuilder';
import { erc721Transfer, erc721TransferBuilder } from './erc721TransferBuilder';
import {
  exactCalldataBatch,
  exactCalldataBatchBuilder,
} from './exactCalldataBatchBuilder';
import { exactCalldata, exactCalldataBuilder } from './exactCalldataBuilder';
import {
  exactExecutionBatch,
  exactExecutionBatchBuilder,
} from './exactExecutionBatchBuilder';
import { exactExecution, exactExecutionBuilder } from './exactExecutionBuilder';
import { id, idBuilder } from './idBuilder';
import { limitedCalls, limitedCallsBuilder } from './limitedCallsBuilder';
import {
  multiTokenPeriod,
  multiTokenPeriodBuilder,
} from './multiTokenPeriodBuilder';
import {
  nativeBalanceChange,
  nativeBalanceChangeBuilder,
} from './nativeBalanceChangeBuilder';
import {
  nativeTokenPayment,
  nativeTokenPaymentBuilder,
} from './nativeTokenPaymentBuilder';
import {
  nativeTokenPeriodTransfer,
  nativeTokenPeriodTransferBuilder,
} from './nativeTokenPeriodTransferBuilder';
import {
  nativeTokenStreaming,
  nativeTokenStreamingBuilder,
} from './nativeTokenStreamingBuilder';
import {
  nativeTokenTransferAmount,
  nativeTokenTransferAmountBuilder,
} from './nativeTokenTransferAmountBuilder';
import { nonce, nonceBuilder } from './nonceBuilder';
import { redeemer, redeemerBuilder } from './redeemerBuilder';
import {
  specificActionERC20TransferBatch,
  specificActionERC20TransferBatchBuilder,
} from './specificActionERC20TransferBatchBuilder';
import { timestamp, timestampBuilder } from './timestampBuilder';
import { valueLte, valueLteBuilder } from './valueLteBuilder';

export { resolveCaveats, CaveatBuilder } from './caveatBuilder';
export type { Caveats, CaveatBuilderConfig } from './caveatBuilder';
export { nativeBalanceChange } from './nativeBalanceChangeBuilder';
export { erc721BalanceChange } from './erc721BalanceChangeBuilder';
export { erc1155BalanceChange } from './erc1155BalanceChangeBuilder';

export const createCaveatBuilder = (
  environment: DeleGatorEnvironment,
  config?: CaveatBuilderConfig,
) => {
  const caveatBuilder = new CaveatBuilder(environment, config)
    .extend(allowedMethods, allowedMethodsBuilder)
    .extend(allowedTargets, allowedTargetsBuilder)
    .extend(deployed, deployedBuilder)
    .extend(allowedCalldata, allowedCalldataBuilder)
    .extend(erc20BalanceChange, erc20BalanceChangeBuilder)
    .extend(erc721BalanceChange, erc721BalanceChangeBuilder)
    .extend(erc1155BalanceChange, erc1155BalanceChangeBuilder)
    .extend(valueLte, valueLteBuilder)
    .extend(limitedCalls, limitedCallsBuilder)
    .extend(id, idBuilder)
    .extend(nonce, nonceBuilder)
    .extend(timestamp, timestampBuilder)
    .extend(blockNumber, blockNumberBuilder)
    .extend(erc20TransferAmount, erc20TransferAmountBuilder)
    .extend(erc20Streaming, erc20StreamingBuilder)
    .extend(nativeTokenStreaming, nativeTokenStreamingBuilder)
    .extend(erc721Transfer, erc721TransferBuilder)
    .extend(nativeTokenTransferAmount, nativeTokenTransferAmountBuilder)
    .extend(nativeBalanceChange, nativeBalanceChangeBuilder)
    .extend(redeemer, redeemerBuilder)
    .extend(nativeTokenPayment, nativeTokenPaymentBuilder)
    .extend(argsEqualityCheck, argsEqualityCheckBuilder)
    .extend(
      specificActionERC20TransferBatch,
      specificActionERC20TransferBatchBuilder,
    )
    .extend(erc20PeriodTransfer, erc20PeriodTransferBuilder)
    .extend(nativeTokenPeriodTransfer, nativeTokenPeriodTransferBuilder)
    .extend(exactCalldataBatch, exactCalldataBatchBuilder)
    .extend(exactCalldata, exactCalldataBuilder)
    .extend(exactExecution, exactExecutionBuilder)
    .extend(exactExecutionBatch, exactExecutionBatchBuilder)
    .extend(multiTokenPeriod, multiTokenPeriodBuilder);

  return caveatBuilder;
};

export type CoreCaveatBuilder = ReturnType<typeof createCaveatBuilder>;
