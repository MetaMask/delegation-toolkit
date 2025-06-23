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
        "name": "_delegator",
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
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "currentNonce",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "nonce",
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
        "name": "nonce_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "incrementNonce",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "UsedNonce",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b5061050e806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063b99deb0e1161005b578063b99deb0e146100eb578063d3eddcc5146100bc578063ed463367146100bc578063f5743c4c146100fe57600080fd5b80632bd4ed2114610082578063414c3e33146100bc578063a145832a146100d8575b600080fd5b6100aa610090366004610314565b600060208181529281526040808220909352908152205481565b60405190815260200160405180910390f35b6100d66100ca366004610390565b50505050505050505050565b005b6100d66100e6366004610390565b610111565b6100aa6100f936600461045d565b61020f565b6100d661010c36600461049f565b61027d565b85600881901b6101228160006102e1565b6101815760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b50600061018e8c8c61020f565b336000908152602081815260408083206001600160a01b038916845290915290205490915081146102015760405162461bcd60e51b815260206004820152601b60248201527f4e6f6e6365456e666f726365723a696e76616c69642d6e6f6e636500000000006044820152606401610178565b505050505050505050505050565b60006020821461026c5760405162461bcd60e51b815260206004820152602260248201527f4e6f6e6365456e666f726365723a696e76616c69642d7465726d732d6c656e676044820152610e8d60f31b6064820152608401610178565b61027682846104ba565b9392505050565b6001600160a01b038116600081815260208181526040808320338085529083529281902080546001810190915590518181529093917fe02d340254c92bc3ad96f0fceb790db939e11c669c1f4c8a549d248f17130b33910160405180910390a35050565b6001600160f81b0319828116908216145b92915050565b80356001600160a01b038116811461030f57600080fd5b919050565b6000806040838503121561032757600080fd5b610330836102f8565b915061033e602084016102f8565b90509250929050565b60008083601f84011261035957600080fd5b50813567ffffffffffffffff81111561037157600080fd5b60208301915083602082850101111561038957600080fd5b9250929050565b60008060008060008060008060008060e08b8d0312156103af57600080fd5b8a3567ffffffffffffffff808211156103c757600080fd5b6103d38e838f01610347565b909c509a5060208d01359150808211156103ec57600080fd5b6103f88e838f01610347565b909a50985060408d0135975060608d013591508082111561041857600080fd5b506104258d828e01610347565b90965094505060808b0135925061043e60a08c016102f8565b915061044c60c08c016102f8565b90509295989b9194979a5092959850565b6000806020838503121561047057600080fd5b823567ffffffffffffffff81111561048757600080fd5b61049385828601610347565b90969095509350505050565b6000602082840312156104b157600080fd5b610276826102f8565b803560208310156102f257600019602084900360031b1b169291505056fea26469706673582212205626dd2329dbdfa25ba379781a5be6c8fc6ae0eb3a22e9122f5d8207bb7de74564736f6c63430008170033" as const;