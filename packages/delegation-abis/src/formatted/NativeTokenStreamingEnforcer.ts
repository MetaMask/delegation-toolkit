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


export const bytecode = "0x608060405234801561001057600080fd5b506109a4806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063d3eddcc51161005b578063d3eddcc514610082578063ed46336714610082578063ee73d772146100e9578063fb7d2c5b1461010a57600080fd5b8063414c3e3314610082578063a145832a1461009e578063b99deb0e146100b1575b600080fd5b61009c610090366004610765565b50505050505050505050565b005b61009c6100ac366004610765565b610177565b6100c46100bf366004610832565b61025c565b6040805194855260208501939093529183015260608201526080015b60405180910390f35b6100fc6100f7366004610874565b610338565b6040519081526020016100e0565b61014f610118366004610874565b6000602081815292815260408082209093529081522080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016100e0565b856101838160006103a3565b6101d45760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101e58160006103a3565b61023f5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084016101cb565b5061024e8c8c898989886103ba565b505050505050505050505050565b6000808080608085146102cb5760405162461bcd60e51b815260206004820152603160248201527f4e6174697665546f6b656e53747265616d696e67456e666f726365723a696e766044820152700c2d8d2c85ae8cae4dae65ad8cadccee8d607b1b60648201526084016101cb565b6102d960206000878961089e565b6102e2916108c8565b93506102f260406020878961089e565b6102fb916108c8565b925061030b60606040878961089e565b610314916108c8565b915061032460806060878961089e565b61032d916108c8565b939692955090935050565b6001600160a01b0382166000908152602081815260408083208484528252808320815160a0810183528154815260018201549381019390935260028101549183019190915260038101546060830152600481015460808301529061039b9061062e565b949350505050565b6001600160f81b0319828116908216145b92915050565b60006103c685856106af565b50509150506000806000806103db8b8b61025c565b93509350935093508383101561044b5760405162461bcd60e51b815260206004820152602f60248201527f4e6174697665546f6b656e53747265616d696e67456e666f726365723a696e7660448201526e185b1a590b5b585e0b585b5bdd5b9d608a1b60648201526084016101cb565b600081116104b85760405162461bcd60e51b815260206004820152603460248201527f4e6174697665546f6b656e53747265616d696e67456e666f726365723a696e76604482015273616c69642d7a65726f2d73746172742d74696d6560601b60648201526084016101cb565b336000908152602081815260408083208a8452909152812060048101549091036104f5578481556001810184905560028101839055600381018290555b6040805160a081018252825481526001830154602082015260028301549181019190915260038201546060820152600482015460808201526105369061062e565b86111561059d5760405162461bcd60e51b815260206004820152602f60248201527f4e6174697665546f6b656e53747265616d696e67456e666f726365723a616c6c60448201526e1bddd85b98d94b595e18d959591959608a1b60648201526084016101cb565b858160040160008282546105b191906108fc565b9091555050600481015460408051878152602081018790529081018590526060810184905260808101919091524260a082015288906001600160a01b0389169033907fa4d5df1d290378aabb8f054b2f3100faf35e2266bb7fbe661f947dfc686704ae9060c00160405180910390a4505050505050505050505050565b6000816060015142101561064457506000919050565b6000826060015142610656919061090f565b9050600081846040015161066a9190610922565b845161067691906108fc565b9050836020015181111561068b575060208301515b808460800151106106a0575060009392505050565b608084015161039b908261090f565b60008036816106c1601482878961089e565b6106ca91610939565b60601c93506106dd60346014878961089e565b6106e6916108c8565b92506106f5856034818961089e565b949793965094505050565b60008083601f84011261071257600080fd5b50813567ffffffffffffffff81111561072a57600080fd5b60208301915083602082850101111561074257600080fd5b9250929050565b80356001600160a01b038116811461076057600080fd5b919050565b60008060008060008060008060008060e08b8d03121561078457600080fd5b8a3567ffffffffffffffff8082111561079c57600080fd5b6107a88e838f01610700565b909c509a5060208d01359150808211156107c157600080fd5b6107cd8e838f01610700565b909a50985060408d0135975060608d01359150808211156107ed57600080fd5b506107fa8d828e01610700565b90965094505060808b0135925061081360a08c01610749565b915061082160c08c01610749565b90509295989b9194979a5092959850565b6000806020838503121561084557600080fd5b823567ffffffffffffffff81111561085c57600080fd5b61086885828601610700565b90969095509350505050565b6000806040838503121561088757600080fd5b61089083610749565b946020939093013593505050565b600080858511156108ae57600080fd5b838611156108bb57600080fd5b5050820193919092039150565b803560208310156103b457600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b808201808211156103b4576103b46108e6565b818103818111156103b4576103b46108e6565b80820281158282048414176103b4576103b46108e6565b6bffffffffffffffffffffffff1981358181169160148510156109665780818660140360031b1b83161692505b50509291505056fea264697066735822122052704058a3717c34d4c81be20ba9801f9b76f6f0c65ef9abba014d246806f21f64736f6c63430008170033" as const;