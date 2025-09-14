# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Uncategorized

- chore: improved types
- chore: improved address type and imports
- Adds Contract Utils (Caveats, Delegation) ([#45](https://github.com/MetaMask/delegation-toolkit/pull/45))
- feat: added contract utils

## [0.2.0-rc.1]

### Added

- Added a Nonce caveat enforcer terms builder `createNonceTerms` ([#44](https://github.com/metamask/delegation-toolkit/pull/44))

### Changed

- The configuration parameter `callData` is now `calldata` in `createExactCalldataTerms` argument type. ([#24](https://github.com/metamask/delegation-toolkit/pull/24))
- The package is explictly marked as ESM via `type: module`; with CJS compatibility maintained with dual export. ([#27](https://github.com/metamask/delegation-toolkit/pull/27))

## [0.1.0]

### Changed

- Add @metamask/delegation-core package, providing utility types, delegation hashing, and terms encoding for a limited set of caveat enforcers.

[Unreleased]: https://github.com/MetaMask/delegation-toolkit/compare/@metamask/delegation-core@0.2.0-rc.1...HEAD
[0.2.0-rc.1]: https://github.com/MetaMask/delegation-toolkit/compare/@metamask/delegation-core@0.1.0...@metamask/delegation-core@0.2.0-rc.1
[0.1.0]: https://github.com/MetaMask/delegation-toolkit/releases/tag/@metamask/delegation-core@0.1.0
