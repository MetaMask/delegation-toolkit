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
        "name": "_token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_recipient",
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
        "name": "token_",
        "type": "address",
        "internalType": "address"
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


export const bytecode = "0x608060405234801561001057600080fd5b5061097c806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063b5e544921161005b578063b5e5449214610115578063b99deb0e14610135578063d3eddcc51461017a578063ed463367146100c557600080fd5b806332a16f4e1461008d578063414c3e33146100c55780635f6f02e0146100e1578063a145832a14610102575b600080fd5b6100b061009b366004610686565b60016020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100df6100d3366004610704565b50505050505050505050565b005b6100f46100ef3660046107d1565b61018d565b6040519081526020016100bc565b6100df610110366004610704565b6101a4565b6100f4610123366004610686565b60006020819052908152604090205481565b61014861014336600461081c565b610357565b6040516100bc949392919093151584526001600160a01b03928316602085015291166040830152606082015260800190565b6100df610188366004610704565b610445565b600061019b85858585610624565b95945050505050565b85600881901b6101b581600061066f565b6102145760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b506000806102228d8d610357565b50925092505060006102363384848a610624565b60008181526001602052604090205490915060ff16156102af5760405162461bcd60e51b815260206004820152602e60248201527f45524337323142616c616e63654368616e6765456e666f726365723a656e666f60448201526d1c98d95c8b5a5ccb5b1bd8dad95960921b606482015260840161020b565b6000818152600160208190526040808320805460ff1916909217909155516370a0823160e01b81526001600160a01b0384811660048301528516906370a0823190602401602060405180830381865afa158015610310573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610334919061085e565b600092835260208390526040909220919091555050505050505050505050505050565b6000808080604985146103c55760405162461bcd60e51b815260206004820152603060248201527f45524337323142616c616e63654368616e6765456e666f726365723a696e766160448201526f0d8d2c85ae8cae4dae65ad8cadccee8d60831b606482015260840161020b565b858560008181106103d8576103d8610877565b909101356001600160f81b031916151594506103fa905060156001878961088d565b610403916108b7565b60601c925061041660296015878961088d565b61041f916108b7565b60601c9150610431856029818961088d565b61043a916108ec565b939692955090935050565b6000806000806104558e8e610357565b9350935093509350600061046b3385858b610624565b600081815260016020526040808220805460ff19169055516370a0823160e01b81526001600160a01b03868116600483015292935090918616906370a0823190602401602060405180830381865afa1580156104cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104ef919061085e565b9050851561058357600082815260208190526040902054610511908490610920565b81101561057e5760405162461bcd60e51b815260206004820152603560248201527f45524337323142616c616e63654368616e6765456e666f726365723a65786365604482015274656465642d62616c616e63652d646563726561736560581b606482015260840161020b565b610612565b60008281526020819052604090205461059d908490610933565b8110156106125760405162461bcd60e51b815260206004820152603960248201527f45524337323142616c616e63654368616e6765456e666f726365723a696e737560448201527f6666696369656e742d62616c616e63652d696e63726561736500000000000000606482015260840161020b565b50505050505050505050505050505050565b604080516001600160a01b03958616602080830191909152948616818301529290941660608301526080808301919091528351808303909101815260a0909101909252815191012090565b6001600160f81b0319828116908216145b92915050565b60006020828403121561069857600080fd5b5035919050565b60008083601f8401126106b157600080fd5b50813567ffffffffffffffff8111156106c957600080fd5b6020830191508360208285010111156106e157600080fd5b9250929050565b80356001600160a01b03811681146106ff57600080fd5b919050565b60008060008060008060008060008060e08b8d03121561072357600080fd5b8a3567ffffffffffffffff8082111561073b57600080fd5b6107478e838f0161069f565b909c509a5060208d013591508082111561076057600080fd5b61076c8e838f0161069f565b909a50985060408d0135975060608d013591508082111561078c57600080fd5b506107998d828e0161069f565b90965094505060808b013592506107b260a08c016106e8565b91506107c060c08c016106e8565b90509295989b9194979a5092959850565b600080600080608085870312156107e757600080fd5b6107f0856106e8565b93506107fe602086016106e8565b925061080c604086016106e8565b9396929550929360600135925050565b6000806020838503121561082f57600080fd5b823567ffffffffffffffff81111561084657600080fd5b6108528582860161069f565b90969095509350505050565b60006020828403121561087057600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b6000808585111561089d57600080fd5b838611156108aa57600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156108e45780818660140360031b1b83161692505b505092915050565b8035602083101561068057600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b818103818111156106805761068061090a565b808201808211156106805761068061090a56fea26469706673582212201a908643c89c30b103124ac1346de2de7964be6fc4c537dea357364db407b9ad64736f6c63430008170033" as const;