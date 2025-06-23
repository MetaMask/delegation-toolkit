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
        "name": "_tokenId",
        "type": "uint256",
        "internalType": "uint256"
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
        "name": "tokenId_",
        "type": "uint256",
        "internalType": "uint256"
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


export const bytecode = "0x608060405234801561001057600080fd5b506109cb806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063b99deb0e1161005b578063b99deb0e14610122578063d0a3529f1461016b578063d3eddcc51461017e578063ed463367146100c557600080fd5b806332a16f4e1461008d578063414c3e33146100c5578063a145832a146100e1578063b5e54492146100f4575b600080fd5b6100b061009b3660046106cb565b60016020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100df6100d3366004610749565b50505050505050505050565b005b6100df6100ef366004610749565b610191565b6101146101023660046106cb565b60006020819052908152604090205481565b6040519081526020016100bc565b610135610130366004610816565b610350565b6040805195151586526001600160a01b03948516602087015292909316918401919091526060830152608082015260a0016100bc565b610114610179366004610858565b61045d565b6100df61018c366004610749565b610476565b85600881901b6101a2816000610661565b6102015760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5060008060006102118e8e610350565b50935093509350506000610228338585858c610678565b60008181526001602052604090205490915060ff16156102a25760405162461bcd60e51b815260206004820152602f60248201527f4552433131353542616c616e63654368616e6765456e666f726365723a656e6660448201526e1bdc98d95c8b5a5ccb5b1bd8dad959608a1b60648201526084016101f8565b6000818152600160208190526040808320805460ff191690921790915551627eeac760e11b81526001600160a01b0385811660048301526024820185905286169062fdd58e90604401602060405180830381865afa158015610308573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061032c91906108ad565b60009283526020839052604090922091909155505050505050505050505050505050565b600080808080606986146103c05760405162461bcd60e51b815260206004820152603160248201527f4552433131353542616c616e63654368616e6765456e666f726365723a696e766044820152700c2d8d2c85ae8cae4dae65ad8cadccee8d607b1b60648201526084016101f8565b868660008181106103d3576103d36108c6565b909101356001600160f81b031916151595506103f5905060156001888a6108dc565b6103fe91610906565b60601c935061041160296015888a6108dc565b61041a91610906565b60601c925061042d60496029888a6108dc565b6104369161093b565b9150610445866049818a6108dc565b61044e9161093b565b60001c90509295509295909350565b600061046c8686868686610678565b9695505050505050565b60008060008060006104888f8f610350565b9450945094509450945060006104a1338686868d610678565b600081815260016020526040808220805460ff1916905551627eeac760e11b81526001600160a01b03878116600483015260248201879052929350909187169062fdd58e90604401602060405180830381865afa158015610506573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061052a91906108ad565b905086156105bf5760008281526020819052604090205461054c90849061096f565b8110156105ba5760405162461bcd60e51b815260206004820152603660248201527f4552433131353542616c616e63654368616e6765456e666f726365723a65786360448201527565656465642d62616c616e63652d646563726561736560501b60648201526084016101f8565b61064e565b6000828152602081905260409020546105d9908490610982565b81101561064e5760405162461bcd60e51b815260206004820152603a60248201527f4552433131353542616c616e63654368616e6765456e666f726365723a696e7360448201527f756666696369656e742d62616c616e63652d696e63726561736500000000000060648201526084016101f8565b5050505050505050505050505050505050565b6001600160f81b0319828116908216145b92915050565b604080516001600160a01b0396871660208083019190915295871681830152939095166060840152608083019190915260a0808301919091528351808303909101815260c0909101909252815191012090565b6000602082840312156106dd57600080fd5b5035919050565b60008083601f8401126106f657600080fd5b50813567ffffffffffffffff81111561070e57600080fd5b60208301915083602082850101111561072657600080fd5b9250929050565b80356001600160a01b038116811461074457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561076857600080fd5b8a3567ffffffffffffffff8082111561078057600080fd5b61078c8e838f016106e4565b909c509a5060208d01359150808211156107a557600080fd5b6107b18e838f016106e4565b909a50985060408d0135975060608d01359150808211156107d157600080fd5b506107de8d828e016106e4565b90965094505060808b013592506107f760a08c0161072d565b915061080560c08c0161072d565b90509295989b9194979a5092959850565b6000806020838503121561082957600080fd5b823567ffffffffffffffff81111561084057600080fd5b61084c858286016106e4565b90969095509350505050565b600080600080600060a0868803121561087057600080fd5b6108798661072d565b94506108876020870161072d565b93506108956040870161072d565b94979396509394606081013594506080013592915050565b6000602082840312156108bf57600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b600080858511156108ec57600080fd5b838611156108f957600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156109335780818660140360031b1b83161692505b505092915050565b8035602083101561067257600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561067257610672610959565b808201808211156106725761067261095956fea264697066735822122095ab63871cc701b6845065f3118822a1bb1778b7d93ba045a40145ebc06f19af64736f6c63430008170033" as const;