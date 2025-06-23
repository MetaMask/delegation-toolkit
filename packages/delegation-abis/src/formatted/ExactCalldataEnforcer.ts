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
        "name": "callData_",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b50610559806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a366004610338565b50505050505050505050565b005b610076610086366004610338565b6100b4565b61009e610099366004610405565b61022b565b6040516100ab9190610447565b60405180910390f35b856100c081600061026b565b6101115760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b61012281600061026b565b61017c5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610108565b5036600061018a8989610282565b935093505050600061019c8f8f61022b565b905082826040516101ae929190610496565b604051809103902081805190602001201461021a5760405162461bcd60e51b815260206004820152602660248201527f457861637443616c6c64617461456e666f726365723a696e76616c69642d63616044820152656c6c6461746160d01b6064820152608401610108565b505050505050505050505050505050565b606082828080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929695505050505050565b6001600160f81b0319828116908216145b92915050565b600080368161029460148287896104a6565b61029d916104d0565b60601c93506102b06034601487896104a6565b6102b991610505565b92506102c885603481896104a6565b949793965094505050565b60008083601f8401126102e557600080fd5b50813567ffffffffffffffff8111156102fd57600080fd5b60208301915083602082850101111561031557600080fd5b9250929050565b80356001600160a01b038116811461033357600080fd5b919050565b60008060008060008060008060008060e08b8d03121561035757600080fd5b8a3567ffffffffffffffff8082111561036f57600080fd5b61037b8e838f016102d3565b909c509a5060208d013591508082111561039457600080fd5b6103a08e838f016102d3565b909a50985060408d0135975060608d01359150808211156103c057600080fd5b506103cd8d828e016102d3565b90965094505060808b013592506103e660a08c0161031c565b91506103f460c08c0161031c565b90509295989b9194979a5092959850565b6000806020838503121561041857600080fd5b823567ffffffffffffffff81111561042f57600080fd5b61043b858286016102d3565b90969095509350505050565b60006020808352835180602085015260005b8181101561047557858101830151858201604001528201610459565b506000604082860101526040601f19601f8301168501019250505092915050565b8183823760009101908152919050565b600080858511156104b657600080fd5b838611156104c357600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156104fd5780818660140360031b1b83161692505b505092915050565b8035602083101561027c57600019602084900360031b1b169291505056fea26469706673582212207ea2be587c5142bd07609ab1e9e3d82af76502619dbab0e88f14c164094d01e564736f6c63430008170033" as const;