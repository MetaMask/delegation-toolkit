# Delegation ABIs

A collection of ABIs for the [Delegation Framework](https://github.com/metamask/delegation-framework). Versioning will be unique to commit hashes of the contracts repo.

## Installation

This package is normally installed as part of the Smart Accounts Kit (@metamask/smart-accounts-kit) which is part of this monorepo.

In order to install this package standalone:

With yarn:
```
yarn add @metamask/delegation-abis
```

With npm:
```
npm install @metamask/delegation-abis
```

## Updating the Delegation Framework and ABIs

In order to update the contracts and ABIs from the Delegation Framework, follow these steps:

### 1. Update the submodule

#### a. Navigate into the Delegation Framework submodule:

```bash
cd ../../lib/delegatable-framework/
```

#### b. Fetch the latest changes

```bash
git fetch
```

#### c. Update to the specific commit or latest

```bash
git checkout <specific-commit>
```

or

```bash
git checkout main
git pull
```

### 2. Generate the ABIs

The `generate.sh` script will build the contracts, outputting ABIs and generate typescript files containing the ABIs. The typescript files are how the ABIs are used within the Smart Accounts Kit.

```bash
 ./scripts/generate.sh
 ```

