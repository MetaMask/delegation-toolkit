# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/metamask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0-rc.2...HEAD
[0.13.0-rc.2]: https://github.com/metamask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0-rc.1...@metamask/delegation-toolkit@0.13.0-rc.2
[0.13.0-rc.1]: https://github.com/metamask/delegation-toolkit/releases/tag/@metamask/delegation-toolkit@0.13.0-rc.1
