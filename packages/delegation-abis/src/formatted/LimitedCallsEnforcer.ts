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
    "name": "callCounts",
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
        "name": "count",
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
        "name": "limit_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "event",
    "name": "IncreasedCount",
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
        "name": "callCount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b506104e9806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806319054d8914610067578063414c3e33146100a1578063a145832a146100bd578063b99deb0e146100d0578063d3eddcc5146100a1578063ed463367146100a1575b600080fd5b61008f6100753660046102ec565b600060208181529281526040808220909352908152205481565b60405190815260200160405180910390f35b6100bb6100af36600461035f565b50505050505050505050565b005b6100bb6100cb36600461035f565b6100e3565b61008f6100de36600461042c565b610244565b85600881901b6100f48160006102b9565b6101535760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5060006101608c8c610244565b33600090815260208181526040808320898452909152812080549293509091829061018a9061046e565b91829055509050818111156101ed5760405162461bcd60e51b815260206004820152602360248201527f4c696d6974656443616c6c73456e666f726365723a6c696d69742d657863656560448201526219195960ea1b606482015260840161014a565b604080518381526020810183905287916001600160a01b0387169133917f449da07f2c06c9d1a6b19d2454ffe749e8cf991d22f686e076a1a4844c5ff370910160405180910390a450505050505050505050505050565b6000602082146102a85760405162461bcd60e51b815260206004820152602960248201527f4c696d6974656443616c6c73456e666f726365723a696e76616c69642d7465726044820152680dae65ad8cadccee8d60bb1b606482015260840161014a565b6102b28284610495565b9392505050565b6001600160f81b0319828116908216145b92915050565b80356001600160a01b03811681146102e757600080fd5b919050565b600080604083850312156102ff57600080fd5b610308836102d0565b946020939093013593505050565b60008083601f84011261032857600080fd5b50813567ffffffffffffffff81111561034057600080fd5b60208301915083602082850101111561035857600080fd5b9250929050565b60008060008060008060008060008060e08b8d03121561037e57600080fd5b8a3567ffffffffffffffff8082111561039657600080fd5b6103a28e838f01610316565b909c509a5060208d01359150808211156103bb57600080fd5b6103c78e838f01610316565b909a50985060408d0135975060608d01359150808211156103e757600080fd5b506103f48d828e01610316565b90965094505060808b0135925061040d60a08c016102d0565b915061041b60c08c016102d0565b90509295989b9194979a5092959850565b6000806020838503121561043f57600080fd5b823567ffffffffffffffff81111561045657600080fd5b61046285828601610316565b90969095509350505050565b60006001820161048e57634e487b7160e01b600052601160045260246000fd5b5060010190565b803560208310156102ca57600019602084900360031b1b169291505056fea264697066735822122058fb87f0b8e8aa4745b9ef395d8bd725c313f876828d7be4c479f4049d6644ac64736f6c63430008170033" as const;