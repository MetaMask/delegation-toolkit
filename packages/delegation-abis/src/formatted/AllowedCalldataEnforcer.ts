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
        "name": "dataStart_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "value_",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b506106dc806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a3660046104a2565b50505050505050505050565b005b6100766100863660046104a2565b6100b5565b61009e61009936600461056f565b610198565b6040516100ac9291906105b1565b60405180910390f35b856100c1816000610265565b6101125760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b610123816000610265565b61017d5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610109565b5061018a8c8c898961027c565b505050505050505050505050565b6000606060218310156102005760405162461bcd60e51b815260206004820152602a60248201527f416c6c6f77656443616c6c64617461456e666f726365723a696e76616c69642d6044820152697465726d732d73697a6560b01b6064820152608401610109565b61020e602060008587610608565b61021791610632565b91506102268360208187610608565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250949792965091945050505050565b6001600160f81b0319828116908216145b92915050565b6000606036600061028d86866103d6565b93509350505061029d8888610198565b80519195509350816102af8287610650565b11156103155760405162461bcd60e51b815260206004820152602f60248201527f416c6c6f77656443616c6c64617461456e666f726365723a696e76616c69642d60448201526e0c6c2d8d8c8c2e8c25ad8cadccee8d608b1b6064820152608401610109565b61036e8386846103258583610650565b9261033293929190610608565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250889250610427915050565b6103cb5760405162461bcd60e51b815260206004820152602860248201527f416c6c6f77656443616c6c64617461456e666f726365723a696e76616c69642d60448201526763616c6c6461746160c01b6064820152608401610109565b505050505050505050565b60008036816103e86014828789610608565b6103f191610671565b60601c9350610404603460148789610608565b61040d91610632565b925061041c8560348189610608565b949793965094505050565b8051602091820120825192909101919091201490565b60008083601f84011261044f57600080fd5b50813567ffffffffffffffff81111561046757600080fd5b60208301915083602082850101111561047f57600080fd5b9250929050565b80356001600160a01b038116811461049d57600080fd5b919050565b60008060008060008060008060008060e08b8d0312156104c157600080fd5b8a3567ffffffffffffffff808211156104d957600080fd5b6104e58e838f0161043d565b909c509a5060208d01359150808211156104fe57600080fd5b61050a8e838f0161043d565b909a50985060408d0135975060608d013591508082111561052a57600080fd5b506105378d828e0161043d565b90965094505060808b0135925061055060a08c01610486565b915061055e60c08c01610486565b90509295989b9194979a5092959850565b6000806020838503121561058257600080fd5b823567ffffffffffffffff81111561059957600080fd5b6105a58582860161043d565b90969095509350505050565b8281526000602060406020840152835180604085015260005b818110156105e6578581018301518582016060015282016105ca565b506000606082860101526060601f19601f830116850101925050509392505050565b6000808585111561061857600080fd5b8386111561062557600080fd5b5050820193919092039150565b8035602083101561027657600019602084900360031b1b1692915050565b8082018082111561027657634e487b7160e01b600052601160045260246000fd5b6bffffffffffffffffffffffff19813581811691601485101561069e5780818660140360031b1b83161692505b50509291505056fea2646970667358221220040ece6946150f16c5413920be7d1b9c5d49d2aae2b6945d7da6faa6f92f5ef664736f6c63430008170033" as const;