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
        "name": "allowance_",
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
        "name": "sender",
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


export const bytecode = "0x608060405234801561001057600080fd5b506105cd806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e33146100675780639dd5d9ab14610083578063a145832a146100bd578063b99deb0e146100d0578063d3eddcc514610067578063ed46336714610067575b600080fd5b6100816100753660046103a7565b50505050505050505050565b005b6100ab610091366004610474565b600060208181529281526040808220909352908152205481565b60405190815260200160405180910390f35b6100816100cb3660046103a7565b6100e3565b6100ab6100de36600461049e565b6102c5565b856100ef8160006102da565b6101405760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101518160006102da565b6101ab5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610137565b5060006101b88d8d6102c5565b905060006101c689896102f1565b5050336000908152602081815260408083208c845290915281208054929450909250839183906101f79084906104e0565b92505081905590508281111561026c5760405162461bcd60e51b815260206004820152603460248201527f4e6174697665546f6b656e5472616e73666572416d6f756e74456e666f7263656044820152731c8e985b1b1bddd85b98d94b595e18d95959195960621b6064820152608401610137565b604080518481526020810183905289916001600160a01b0389169133917fc026e493323d526061a052b5dd562495120e2f648797a48be61966d3a6beec8d910160405180910390a4505050505050505050505050505050565b60006102d382840184610501565b9392505050565b6001600160f81b0319828116908216145b92915050565b6000803681610303601482878961051a565b61030c91610544565b60601c935061031f60346014878961051a565b61032891610579565b9250610337856034818961051a565b949793965094505050565b60008083601f84011261035457600080fd5b50813567ffffffffffffffff81111561036c57600080fd5b60208301915083602082850101111561038457600080fd5b9250929050565b80356001600160a01b03811681146103a257600080fd5b919050565b60008060008060008060008060008060e08b8d0312156103c657600080fd5b8a3567ffffffffffffffff808211156103de57600080fd5b6103ea8e838f01610342565b909c509a5060208d013591508082111561040357600080fd5b61040f8e838f01610342565b909a50985060408d0135975060608d013591508082111561042f57600080fd5b5061043c8d828e01610342565b90965094505060808b0135925061045560a08c0161038b565b915061046360c08c0161038b565b90509295989b9194979a5092959850565b6000806040838503121561048757600080fd5b6104908361038b565b946020939093013593505050565b600080602083850312156104b157600080fd5b823567ffffffffffffffff8111156104c857600080fd5b6104d485828601610342565b90969095509350505050565b808201808211156102eb57634e487b7160e01b600052601160045260246000fd5b60006020828403121561051357600080fd5b5035919050565b6000808585111561052a57600080fd5b8386111561053757600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156105715780818660140360031b1b83161692505b505092915050565b803560208310156102eb57600019602084900360031b1b169291505056fea2646970667358221220242bcbb545bdb30c0cc3054c27d7e861e0e03c97037d12e0a3a635b723f4c96064736f6c63430008170033" as const;