# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Uncategorized

- Rename @metamask/permission-types to @metamask/7715-permission-types
- Update the 7715 experimental actions to new Erc7715 interface ([#54](https://github.com/MetaMask/delegation-toolkit/pull/54))
- Remove duplicate createCaveatEnforcerClient and type
- Fix jsdoc comments in getCaveatAvailableAmount.ts
- Move caveatEnforcerClient into it's own file
- Improve action tests, remove client tests.
- Improve internals of getCaveatAvailableAmount actions. Improve validation messages when caveats are not found, or duplicates are found.
- Fix package exports, straggling tests, and import order.
- use getDelegationHashoffchain function instead of delegation-core hashDelegation directly. Use type assertion when destructuring foundCaveats.
- Fix tests
- style: remove extra whitespace in getCaveatAvailableAmount.ts
- refactor: use destructuring in findMatchingCaveat function
- refactor: add caveatEnforcerActions back to actions export
- refactor: remove client exports from actions index (moved to main export)
- refactor: consolidate parameter types into single CaveatEnforcerParams type
- refactor: replace custom error types with standard Error constructor
- refactor: simplify actions to only accept delegation and use environment values
- refactor: modify existing actions to accept delegation instead of creating new ones
- feat: move caveat enforcer client to main export
- feat: add delegation-based caveat enforcer actions
- fix: fixing conflicts
- chore: 7702 validation improvements
- chore: using viem address comparison
- chore: 7702 is valid implementation code
- chore: override isDeployed function
- chore: override is deployed viem function
- Adds Contract Utils (Caveats, Delegation) ([#45](https://github.com/MetaMask/delegation-toolkit/pull/45))
- chore: fixing types in tests
- chore: caveat enforcer configs, and extend
- feat: added contract utils

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

[Unreleased]: https://github.com/MetaMask/delegation-toolkit/compare/@metamask/delegation-toolkit@0.13.0-rc.1...HEAD
[0.13.0-rc.1]: https://github.com/MetaMask/delegation-toolkit/releases/tag/@metamask/delegation-toolkit@0.13.0-rc.1
