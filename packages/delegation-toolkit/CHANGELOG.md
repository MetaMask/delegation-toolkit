# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.13.0]

### Uncategorized

- Rename Signatory to Signer ([#76](https://github.com/MetaMask/delegation-toolkit/pull/76))
- Support calling wallet_requestExecutionPermissions directly on the wallet api ([#60](https://github.com/MetaMask/delegation-toolkit/pull/60))
- refactor: rename signatory to signer
- feat: improve types by replacing `0x${string}` with proper viem types
- fix: issue in test
- chore: deleted duplicated code
- chore: improved return types in the utils
- chore: improved address type and imports
- chore: added SpecificActionERC20TransferBatchEnforcer utils
- chore: added nonce enforcer utils
- chore: added limited calls enforcer utils
- chore: fix yarn lint for nonce utils
- chore: added IdEnforcer utils
- chore: nativeTokenTransferAmount utils
- feat: contract utils for ERC20TransferAmountEnforcer
- Improve declarative delegation interface ([#63](https://github.com/MetaMask/delegation-toolkit/pull/63))
- chore: reverted validation changes
- Tidy up Utilities and Actions ([#68](https://github.com/MetaMask/delegation-toolkit/pull/68))
- refactor: modernize allowedCalldata checks with optional chaining
- chore: renamed, and exposed functions
- Release/11.0.0 ([#71](https://github.com/MetaMask/delegation-toolkit/pull/71))
- Revert "Release/11.0.0" ([#70](https://github.com/MetaMask/delegation-toolkit/pull/70))
- Deleted Public Client From CaveatEnforcerClient ([#64](https://github.com/MetaMask/delegation-toolkit/pull/64))
- fix: update tests
- refactor: tidy up utilities and actions
- Fix failing validate changelog CI job
- Update change log for 7715-permission-types
- Update yarn lock
- Initialize Release 11.0.0
- chore: prevent doble calldata
- docs: improved comments
- chore: deleted public client from caveatEnforcerClient
- fix: empty calldata array bypasses security checks
- refactor: improve declarative delegation interface
- test: infura bundler + delegation toolkit ([#59](https://github.com/MetaMask/delegation-toolkit/pull/59))
- chore: renamed external folder, and types
- feat: added infura bundler client

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

[Unreleased]: https://github.com/MetaMask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0...HEAD
[0.13.0]: https://github.com/MetaMask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0-rc.3...@metamask/delegation-toolkit@0.13.0
[0.13.0-rc.3]: https://github.com/MetaMask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0-rc.2...@metamask/delegation-toolkit@0.13.0-rc.3
[0.13.0-rc.2]: https://github.com/MetaMask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0-rc.1...@metamask/delegation-toolkit@0.13.0-rc.2
[0.13.0-rc.1]: https://github.com/MetaMask/delegation-toolkit/releases/tag/@metamask/delegation-toolkit@0.13.0-rc.1
