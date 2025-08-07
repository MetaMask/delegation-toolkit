/**
 * Union type defining all available scope types for delegation caveats.
 * Each scope type represents a specific permission pattern or constraint.
 */
export type ScopeType =
  /** ERC20 token transfer with amount limits */
  | 'erc20-transfer'
  /** ERC20 token streaming with time-based limits */
  | 'erc20-streaming'
  /** ERC20 token periodic transfer with recurring limits */
  | 'erc20-periodic'
  /** ERC721 NFT transfer */
  | 'erc721'
  /** Native token transfer with amount limits */
  | 'nativeToken-transfer'
  /** Native token streaming with time-based limits */
  | 'nativeToken-streaming'
  /** Native token periodic transfer with recurring limits */
  | 'nativeToken-periodic'
  /** Contract ownership transfer */
  | 'ownership'
  /** Specific function call permissions */
  | 'functionCall';
