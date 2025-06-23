export const abi = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "allowedContract_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "maxTokens_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "spentMap",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "IncreasedSpentMap",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "limit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "spent",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b5061081e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e33146100675780639dd5d9ab14610083578063a145832a146100be578063b99deb0e146100d1578063d3eddcc514610067578063ed46336714610067575b600080fd5b6100816100753660046105c3565b50505050505050505050565b005b6100ab610091366004610690565b600060208181529281526040808220909352908152205481565b6040519081526020015b60405180910390f35b6100816100cc3660046105c3565b610103565b6100e46100df3660046106ba565b610247565b604080516001600160a01b0390931683526020830191909152016100b5565b8561010f8160006102df565b6101605760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101718160006102df565b6101cb5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610157565b506000806101dc8e8e8b8b8b6102f6565b9150915086856001600160a01b0316336001600160a01b03167fc026e493323d526061a052b5dd562495120e2f648797a48be61966d3a6beec8d858560405161022f929190918252602082015260400190565b60405180910390a45050505050505050505050505050565b600080603483146102a15760405162461bcd60e51b815260206004820152603060248201526000805160206107c983398151915260448201526f0d8d2c85ae8cae4dae65ad8cadccee8d60831b6064820152608401610157565b6102af6014600085876106fc565b6102b891610726565b60601c91506102ca83601481876106fc565b6102d39161075b565b60001c90509250929050565b6001600160f81b0319828116908216145b92915050565b6000806000366000610308888861050d565b9295509350909150506044811461036c5760405162461bcd60e51b815260206004820152603460248201526000805160206107c98339815191526044820152730d8d2c85acaf0cac6eae8d2dedc5ad8cadccee8d60631b6064820152608401610157565b60006103788b8b610247565b965090506001600160a01b03808216908516146103da5760405162461bcd60e51b815260206004820152602c60248201526000805160206107c983398151915260448201526b1b1a590b58dbdb9d1c9858dd60a21b6064820152608401610157565b63a9059cbb60e01b6103f06004600085876106fc565b6103f991610779565b6001600160e01b031916146104515760405162461bcd60e51b815260206004820152602a60248201526000805160206107c98339815191526044820152691b1a590b5b595d1a1bd960b21b6064820152608401610157565b61045f6044602484866106fc565b6104689161075b565b336000908152602081815260408083208b8452909152812080549091906104909084906107a7565b9250508190559450858511156104ff5760405162461bcd60e51b815260206004820152602e60248201527f45524332305472616e73666572416d6f756e74456e666f726365723a616c6c6f60448201526d1dd85b98d94b595e18d95959195960921b6064820152608401610157565b505050509550959350505050565b600080368161051f60148287896106fc565b61052891610726565b60601c935061053b6034601487896106fc565b6105449161075b565b925061055385603481896106fc565b949793965094505050565b60008083601f84011261057057600080fd5b50813567ffffffffffffffff81111561058857600080fd5b6020830191508360208285010111156105a057600080fd5b9250929050565b80356001600160a01b03811681146105be57600080fd5b919050565b60008060008060008060008060008060e08b8d0312156105e257600080fd5b8a3567ffffffffffffffff808211156105fa57600080fd5b6106068e838f0161055e565b909c509a5060208d013591508082111561061f57600080fd5b61062b8e838f0161055e565b909a50985060408d0135975060608d013591508082111561064b57600080fd5b506106588d828e0161055e565b90965094505060808b0135925061067160a08c016105a7565b915061067f60c08c016105a7565b90509295989b9194979a5092959850565b600080604083850312156106a357600080fd5b6106ac836105a7565b946020939093013593505050565b600080602083850312156106cd57600080fd5b823567ffffffffffffffff8111156106e457600080fd5b6106f08582860161055e565b90969095509350505050565b6000808585111561070c57600080fd5b8386111561071957600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156107535780818660140360031b1b83161692505b505092915050565b803560208310156102f057600019602084900360031b1b1692915050565b6001600160e01b031981358181169160048510156107535760049490940360031b84901b1690921692915050565b808201808211156102f057634e487b7160e01b600052601160045260246000fdfe45524332305472616e73666572416d6f756e74456e666f726365723a696e7661a2646970667358221220936350618a5001f34797bf97c50cd107709e028340c60e13df9fe9a2d10d7fb364736f6c63430008170033" as const;