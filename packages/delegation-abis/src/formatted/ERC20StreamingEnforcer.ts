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
    "name": "getAvailableAmount",
    "inputs": [
      {
        "name": "_delegationManager",
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
        "name": "availableAmount_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
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
        "name": "token_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "initialAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amountPerSecond_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startTime_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "streamingAllowances",
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
        "name": "initialAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amountPerSecond",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "spent",
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
        "name": "token",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "initialAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "maxAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amountPerSecond",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "startTime",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "spent",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "lastUpdateTimestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b50610b7d806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063d3eddcc51161005b578063d3eddcc514610082578063ed46336714610082578063ee73d772146100fb578063fb7d2c5b1461011c57600080fd5b8063414c3e3314610082578063a145832a1461009e578063b99deb0e146100b1575b600080fd5b61009c610090366004610910565b50505050505050505050565b005b61009c6100ac366004610910565b610189565b6100c46100bf3660046109dd565b61026e565b604080516001600160a01b0390961686526020860194909452928401919091526060830152608082015260a0015b60405180910390f35b61010e610109366004610a1f565b610365565b6040519081526020016100f2565b61016161012a366004610a1f565b6000602081815292815260408082209093529081522080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016100f2565b856101958160006103d0565b6101e65760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101f78160006103d0565b6102515760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084016101dd565b506102608c8c898989886103e7565b505050505050505050505050565b600080808080609486146102d85760405162461bcd60e51b815260206004820152602b60248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d7460448201526a0cae4dae65ad8cadccee8d60ab1b60648201526084016101dd565b6102e660146000888a610a49565b6102ef91610a73565b60601c945061030260346014888a610a49565b61030b91610aa8565b935061031b60546034888a610a49565b61032491610aa8565b925061033460746054888a610a49565b61033d91610aa8565b915061034d60946074888a610a49565b61035691610aa8565b60001c90509295509295909350565b6001600160a01b0382166000908152602081815260408083208484528252808320815160a081018352815481526001820154938101939093526002810154918301919091526003810154606083015260048101546080830152906103c8906107d9565b949350505050565b6001600160f81b0319828116908216145b92915050565b60003660006103f6878761085a565b929550935090915050604481146104675760405162461bcd60e51b815260206004820152602f60248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d6560448201526e0f0cac6eae8d2dedc5ad8cadccee8d608b1b60648201526084016101dd565b60008060008060006104798e8e61026e565b94509450945094509450838310156104e55760405162461bcd60e51b815260206004820152602960248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d6d604482015268185e0b585b5bdd5b9d60ba1b60648201526084016101dd565b6000811161054c5760405162461bcd60e51b815260206004820152602e60248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d7a60448201526d65726f2d73746172742d74696d6560901b60648201526084016101dd565b876001600160a01b0316856001600160a01b0316146105bd5760405162461bcd60e51b815260206004820152602760248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d636044820152661bdb9d1c9858dd60ca1b60648201526084016101dd565b63a9059cbb60e01b6105d360046000898b610a49565b6105dc91610ac6565b6001600160e01b031916146106415760405162461bcd60e51b815260206004820152602560248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d6d604482015264195d1a1bd960da1b60648201526084016101dd565b336000908152602081815260408083208d84529091528120600481015490910361067e578481556001810184905560028101839055600381018290555b600061068e604460248a8c610a49565b61069791610aa8565b6040805160a081018252845481526001850154602082015260028501549181019190915260038401546060820152600484015460808201529091506106db906107d9565b81111561073c5760405162461bcd60e51b815260206004820152602960248201527f455243323053747265616d696e67456e666f726365723a616c6c6f77616e63656044820152680b595e18d95959195960ba1b60648201526084016101dd565b808260040160008282546107509190610b0a565b90915550506004820154604080516001600160a01b038a81168252602082018a9052818301899052606082018890526080820187905260a08201939093524260c082015290518e928e169133917f30ceca901166c86cac9d1024230d7f5740b26cce6bdd9bad7b1d6e616904ea639181900360e00190a450505050505050505050505050505050565b600081606001514210156107ef57506000919050565b60008260600151426108019190610b1d565b905060008184604001516108159190610b30565b84516108219190610b0a565b90508360200151811115610836575060208301515b8084608001511061084b575060009392505050565b60808401516103c89082610b1d565b600080368161086c6014828789610a49565b61087591610a73565b60601c9350610888603460148789610a49565b61089191610aa8565b92506108a08560348189610a49565b949793965094505050565b60008083601f8401126108bd57600080fd5b50813567ffffffffffffffff8111156108d557600080fd5b6020830191508360208285010111156108ed57600080fd5b9250929050565b80356001600160a01b038116811461090b57600080fd5b919050565b60008060008060008060008060008060e08b8d03121561092f57600080fd5b8a3567ffffffffffffffff8082111561094757600080fd5b6109538e838f016108ab565b909c509a5060208d013591508082111561096c57600080fd5b6109788e838f016108ab565b909a50985060408d0135975060608d013591508082111561099857600080fd5b506109a58d828e016108ab565b90965094505060808b013592506109be60a08c016108f4565b91506109cc60c08c016108f4565b90509295989b9194979a5092959850565b600080602083850312156109f057600080fd5b823567ffffffffffffffff811115610a0757600080fd5b610a13858286016108ab565b90969095509350505050565b60008060408385031215610a3257600080fd5b610a3b836108f4565b946020939093013593505050565b60008085851115610a5957600080fd5b83861115610a6657600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff198135818116916014851015610aa05780818660140360031b1b83161692505b505092915050565b803560208310156103e157600019602084900360031b1b1692915050565b6001600160e01b03198135818116916004851015610aa05760049490940360031b84901b1690921692915050565b634e487b7160e01b600052601160045260246000fd5b808201808211156103e1576103e1610af4565b818103818111156103e1576103e1610af4565b80820281158282048414176103e1576103e1610af456fea2646970667358221220d9282c553e448eac7b4631259f5a457c28077fd4d88ef08db72ec3df532e99ed64736f6c63430008170033" as const;