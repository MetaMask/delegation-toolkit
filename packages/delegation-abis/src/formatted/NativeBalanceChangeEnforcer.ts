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
    "name": "balanceCache",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
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
        "name": "",
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
    "name": "getHashKey",
    "inputs": [
      {
        "name": "_caller",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
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
        "name": "enforceDecrease_",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "recipient_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "isLocked",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "lock",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b50610824806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063b5e544921161005b578063b5e5449214610115578063b99deb0e14610135578063d3eddcc51461016d578063ed463367146100c557600080fd5b806332a16f4e1461008d578063414c3e33146100c5578063a145832a146100e1578063a79a0db5146100f4575b600080fd5b6100b061009b366004610568565b60016020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100df6100d33660046105e6565b50505050505050505050565b005b6100df6100ef3660046105e6565b610180565b6101076101023660046106b3565b6102c6565b6040519081526020016100bc565b610107610123366004610568565b60006020819052908152604090205481565b6101486101433660046106dd565b6102db565b6040805193151584526001600160a01b039092166020840152908201526060016100bc565b6100df61017b3660046105e6565b6103ad565b85600881901b6001600160f81b03198116156101f15760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5060006101fe338661052b565b9050600061020c8d8d6102db565b5060008481526001602052604090205490925060ff161590506102885760405162461bcd60e51b815260206004820152602e60248201527f4e617469766542616c616e63654368616e6765456e666f726365723a656e666f60448201526d1c98d95c8b5a5ccb5b1bd8dad95960921b60648201526084016101e8565b6000918252600160208181526040808520805460ff19169093179092558390529091206001600160a01b039091163190555050505050505050505050565b60006102d2838361052b565b90505b92915050565b60008080603584146103485760405162461bcd60e51b815260206004820152603060248201527f4e617469766542616c616e63654368616e6765456e666f726365723a696e766160448201526f0d8d2c85ae8cae4dae65ad8cadccee8d60831b60648201526084016101e8565b8484600081811061035b5761035b61071f565b909101356001600160f81b0319161515935061037d9050601560018688610735565b6103869161075f565b60601c91506103988460158188610735565b6103a191610794565b60001c90509250925092565b60008060006103bc8d8d6102db565b92509250925060006103ce338861052b565b6000818152600160205260409020805460ff1916905590508315610482576000818152602081905260409020546104069083906107c8565b836001600160a01b031631101561047d5760405162461bcd60e51b815260206004820152603560248201527f4e617469766542616c616e63654368616e6765456e666f726365723a65786365604482015274656465642d62616c616e63652d646563726561736560581b60648201526084016101e8565b61051b565b60008181526020819052604090205461049c9083906107db565b836001600160a01b031631101561051b5760405162461bcd60e51b815260206004820152603960248201527f4e617469766542616c616e63654368616e6765456e666f726365723a696e737560448201527f6666696369656e742d62616c616e63652d696e6372656173650000000000000060648201526084016101e8565b5050505050505050505050505050565b604080516001600160a01b038416602082015290810182905260009060600160405160208183030381529060405280519060200120905092915050565b60006020828403121561057a57600080fd5b5035919050565b60008083601f84011261059357600080fd5b50813567ffffffffffffffff8111156105ab57600080fd5b6020830191508360208285010111156105c357600080fd5b9250929050565b80356001600160a01b03811681146105e157600080fd5b919050565b60008060008060008060008060008060e08b8d03121561060557600080fd5b8a3567ffffffffffffffff8082111561061d57600080fd5b6106298e838f01610581565b909c509a5060208d013591508082111561064257600080fd5b61064e8e838f01610581565b909a50985060408d0135975060608d013591508082111561066e57600080fd5b5061067b8d828e01610581565b90965094505060808b0135925061069460a08c016105ca565b91506106a260c08c016105ca565b90509295989b9194979a5092959850565b600080604083850312156106c657600080fd5b6106cf836105ca565b946020939093013593505050565b600080602083850312156106f057600080fd5b823567ffffffffffffffff81111561070757600080fd5b61071385828601610581565b90969095509350505050565b634e487b7160e01b600052603260045260246000fd5b6000808585111561074557600080fd5b8386111561075257600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff19813581811691601485101561078c5780818660140360031b1b83161692505b505092915050565b803560208310156102d557600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b818103818111156102d5576102d56107b2565b808201808211156102d5576102d56107b256fea2646970667358221220b33a5c188759ed62e28774f4ab95ff422856e7b7a36f7de87da5f14ed435ece964736f6c63430008170033" as const;