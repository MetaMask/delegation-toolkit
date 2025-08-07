import type { erc20PeriodTransfer } from '../erc20PeriodTransferBuilder';
import type { erc20Streaming } from '../erc20StreamingBuilder';
import type { erc20TransferAmount } from '../erc20TransferAmountBuilder';
import type { erc721Transfer } from '../erc721TransferBuilder';
import type { nativeTokenPeriodTransfer } from '../nativeTokenPeriodTransferBuilder';
import type { nativeTokenStreaming } from '../nativeTokenStreamingBuilder';
import type { nativeTokenTransferAmount } from '../nativeTokenTransferAmountBuilder';
import type { ownershipTransfer } from '../ownershipTransferBuilder';

/**
 * Union type defining all available scope types for delegation caveats.
 * Each scope type represents a specific permission pattern or constraint.
 * These reference the actual caveat builder name constants for consistency.
 */
export type ScopeType =
  /** ERC20 token transfer with amount limits */
  | typeof erc20TransferAmount
  /** ERC20 token streaming with time-based limits */
  | typeof erc20Streaming
  /** ERC20 token periodic transfer with recurring limits */
  | typeof erc20PeriodTransfer
  /** ERC721 NFT transfer */
  | typeof erc721Transfer
  /** Native token transfer with amount limits */
  | typeof nativeTokenTransferAmount
  /** Native token streaming with time-based limits */
  | typeof nativeTokenStreaming
  /** Native token periodic transfer with recurring limits */
  | typeof nativeTokenPeriodTransfer
  /** Contract ownership transfer */
  | typeof ownershipTransfer
  /** Specific function call permissions - uses literal as it maps to multiple caveats */
  | 'functionCall';
