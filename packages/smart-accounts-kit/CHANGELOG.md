# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.13.0]

### Added

- Delegation Scopes and a declarative API to define delegation caveats ([#51](https://github.com/MetaMask/delegation-toolkit/pull/51))
- New utilities and actions for interacting with the Delegation Framework smart contracts ([#45](https://github.com/MetaMask/delegation-toolkit/pull/45))
- A new Client for interacting with the Infura Bundler ([#59](https://github.com/MetaMask/delegation-toolkit/pull/59))
- Utilities for interacting with caveat enforcer contracts
  - `SpecificActionERC20TransferBatchEnforcer`
  - `NonceEnforcer`
  - `LimitedCallsEnforcer`
  - `IdEnforcer`
  - `NativeTokenTransferAmount`
  - `ERC20TransferAmountEnforcer`

### Changed

- Utility and Action interfaces are now more closely aligned with Viem's patterns ([#68](https://github.com/MetaMask/delegation-toolkit/pull/68))
  - `signUserOperation` and `signDelegation` utilities now accept privateKey parameter instead of `WalletClient`
  - `signDelegationAction` and `signUserOperationAction` wallet actions makes it easier to extend a `WalletClient` instance
- It is now much easier to create Delegations with the required authority
  - `allowInsecureUnrestrictedDelegation: true` is now required when creating or signing a delegation with no caveats. ([#24](https://github.com/metamask/delegation-toolkit/pull/24))
  - The `CaveatBuilder.addCaveat` function now accepts a single caveat configuration object instead of positional arguments. ([#24](https://github.com/metamask/delegation-toolkit/pull/24))
  - A delegation can now be created with a declarative interface, utilising "scopes" to define the scope of authority being granted by the delegation ([#63](https://github.com/MetaMask/delegation-toolkit/pull/63))
- `Signatory` is renamed to `Signer` for more clarity when creating `MetaMaskSmartAccount` instances ([#76](https://github.com/MetaMask/delegation-toolkit/pull/76))
- The experimental EIP-7715 actions have been updated to align with the current implementation of the specification:
  - Now requires are direct to the `wallet_requestExecutionPermissions` method on the wallet api ([#60](https://github.com/MetaMask/delegation-toolkit/pull/60))
  - The datatypes used in the call have been updated to align with the new Erc7715 interface ([#54](https://github.com/MetaMask/delegation-toolkit/pull/54))
  - The `startTime` parameter is now optional on all permission types
- The Viem peer dependency is now `viem@^2.31.4`. ([#22](https://github.com/metamask/delegation-toolkit/pull/22))
- Individual constants like `SINGLE_DEFAULT_MODE` have been replaced with the `ExecutionMode` enum ([#16](https://github.com/metamask/delegation-toolkit/pull/16))
- The test runner is now Vitest, with Hardhat removed entirely ([#27](https://github.com/metamask/delegation-toolkit/pull/27))

### Fixed

- `sendTransactionWithDelegation` failed whenever `value` was specified in the parameters. ([#30](https://github.com/metamask/delegation-toolkit/pull/30))

## [0.13.0-rc.3]

### Added

- Delegation Scopes and a declarative API to define delegation caveats ([#51](https://github.com/MetaMask/delegation-toolkit/pull/51))

## [0.13.0-rc.2]

### Added

- New utilities and actions for interacting with the Delegation Framework smart contracts ([#45](https://github.com/MetaMask/delegation-toolkit/pull/45))

### Changed

- The 7715 experimental actions not align with the new Erc7715 interface ([#54](https://github.com/MetaMask/delegation-toolkit/pull/54))

## [0.13.0-rc.1]

### Changed

- The `startTime` parameter is now optional when requesting permissions through the experimental `erc7715ProviderActions`.
- The Viem peer dependency is now `viem@^2.31.4`. ([#22](https://github.com/metamask/delegation-toolkit/pull/22))
- Individual constants like `SINGLE_DEFAULT_MODE` are now replaced with the `ExecutionMode` enum. ([#16](https://github.com/metamask/delegation-toolkit/pull/16))
- `allowInsecureUnrestrictedDelegation: true` is now required when creating or signing a delegation with no caveats. ([#24](https://github.com/metamask/delegation-toolkit/pull/24))
- `CaveatBuilder` now accepts a single caveat configuration object instead of positional arguments. ([#24](https://github.com/metamask/delegation-toolkit/pull/24))
- The test runner is now Vitest, with Hardhat removed entirely. ([#27](https://github.com/metamask/delegation-toolkit/pull/27))

### Fixed

- Fixed a bug where `sendTransactionWithDelegation` failed whenever `value` was specified in the parameters. ([#30](https://github.com/metamask/delegation-toolkit/pull/30))

[Unreleased]: https://github.com/metamask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0...HEAD
[0.13.0]: https://github.com/metamask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0-rc.3...@metamask/delegation-toolkit@0.13.0
[0.13.0-rc.3]: https://github.com/metamask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0-rc.2...@metamask/delegation-toolkit@0.13.0-rc.3
[0.13.0-rc.2]: https://github.com/metamask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0-rc.1...@metamask/delegation-toolkit@0.13.0-rc.2
[0.13.0-rc.1]: https://github.com/metamask/delegation-toolkit/releases/tag/@metamask/delegation-toolkit@0.13.0-rc.1
