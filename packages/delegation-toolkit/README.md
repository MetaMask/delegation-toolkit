# MetaMask Delegation Toolkit

The MetaMask Delegation Toolkit is a [Viem](https://viem.sh)-based collection of tools for integrating MetaMask embedded smart account and create frictionless new experiences based on granular permission sharing and trust.

## Features
---
- **Smart Account Support**: Provides high-level API for deploying, and managing MetaMask smart account.
- **Delegation Framework Support**: Comprehensive support for [ERC-7710](https://eips.ethereum.org/EIPS/eip-7710) to create, manage, and redeem delegations.
- **Prebuilt Caveat Enforcers**: Prebuilt caveat enforcers for adding restrictions and conditions to delegations.
- **Modular and Extensible**: Enables configuration of custom bundlers, paymasters, signers, and specialized caveat enforcers.
- and many more...


## Installation
---

Yarn:
```sh
yarn add @metamask/delegation-toolkit
```

Npm:
```sh
npm install @metamask/delegation-toolkit
```

## Overview 
---

```ts
import { createPublicClient, http } from "viem";
import { sepolia as chain } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import {
  Implementation,
  toMetaMaskSmartAccount,
} from "@metamask/delegation-toolkit";

const publicClient = createPublicClient({
  chain,
  transport: http(),
});

const account = privateKeyToAccount("0x...");

const smartAccount = await toMetaMaskSmartAccount({
  client: publicClient,
  implementation: Implementation.Hybrid,
  deployParams: [account.address, [], [], []],
  deploySalt: "0x",
  signatory: { account },
});
```


## Documentation
---
[Head to our documentation](https://docs.gator.metamask.io) to learn more about the Delegation Toolkit.

## Contributing
---

If you are interested in contributing, please [see the contribution guide](/CONTRIBUTING.md#Contributing).


## Useful Links
- [Delegation Toolkit Quick start](https://docs.metamask.io/delegation-toolkit/get-started/quickstart/)
- [Delegation Toolkit CLI Quick start](https://docs.metamask.io/delegation-toolkit/development/get-started/cli-quickstart/)
- [Scaffold ETH extension](https://github.com/metamask/gator-extension)
- [API reference](https://docs.metamask.io/delegation-toolkit/development/reference/)