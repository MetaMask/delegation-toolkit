# Delegation Framework Deployments

A history of [Delegation Framework](https://github.com/metamask/delegation-framework) deployments. Versioning inside the JSON for deploymented mapped to the [github tags](https://github.com/MetaMask/delegation-framework/tags).

## Installation

This package is normally installed as part of the Smart Accounts Kit (@metamask/smart-accounts-kit) which is part of this monorepo.

In order to install this package standalone:

With yarn:
```
yarn add @metamask/delegation-deployments
```

With npm:
```
npm install @metamask/delegation-deployments
```

## Contributing

Deployment addresses are manually added to `src/contractAddresses.ts` and assigned to versions and chains in `src/index.ts`.

In order to validate that the latest version of contracts is deployed to all supported chains, run:

```
yarn validate-latest-contracts
```

This will identify the latest version of the contracts, iterate the supported chains, and check that code is deployed at the specified address.

