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
        "name": "execution_",
        "type": "tuple",
        "internalType": "struct Execution",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "pure"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b5061062f806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a3660046103e9565b50505050505050505050565b005b6100766100863660046103e9565b6100b4565b61009e6100993660046104b6565b610197565b6040516100ab91906104f8565b60405180910390f35b856100c0816000610210565b6101115760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b610122816000610210565b61017c5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610108565b506101898c8c8989610227565b505050505050505050505050565b604080516060808201835260008083526020830152918101919091526101bd8383610333565b81818080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050506040860152505060208301526001600160a01b0316815292915050565b6001600160f81b0319828116908216145b92915050565b6000803660006102378686610333565b929650909450925090506001600160a01b038416610259601460008a8c61056c565b61026291610596565b60601c14801561028757508261027c603460148a8c61056c565b610285916105cb565b145b80156102cc5750818160405161029e9291906105e9565b6040519081900390206102b4886034818c61056c565b6040516102c29291906105e9565b6040518091039020145b6103295760405162461bcd60e51b815260206004820152602860248201527f4578616374457865637574696f6e456e666f726365723a696e76616c69642d656044820152673c32b1baba34b7b760c11b6064820152608401610108565b5050505050505050565b6000803681610345601482878961056c565b61034e91610596565b60601c935061036160346014878961056c565b61036a916105cb565b9250610379856034818961056c565b949793965094505050565b60008083601f84011261039657600080fd5b50813567ffffffffffffffff8111156103ae57600080fd5b6020830191508360208285010111156103c657600080fd5b9250929050565b80356001600160a01b03811681146103e457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561040857600080fd5b8a3567ffffffffffffffff8082111561042057600080fd5b61042c8e838f01610384565b909c509a5060208d013591508082111561044557600080fd5b6104518e838f01610384565b909a50985060408d0135975060608d013591508082111561047157600080fd5b5061047e8d828e01610384565b90965094505060808b0135925061049760a08c016103cd565b91506104a560c08c016103cd565b90509295989b9194979a5092959850565b600080602083850312156104c957600080fd5b823567ffffffffffffffff8111156104e057600080fd5b6104ec85828601610384565b90969095509350505050565b6000602080835260018060a01b038451166020840152602084015160408401526040840151606080850152805180608086015260005b8181101561054a5782810184015186820160a00152830161052e565b50600060a0828701015260a0601f19601f830116860101935050505092915050565b6000808585111561057c57600080fd5b8386111561058957600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156105c35780818660140360031b1b83161692505b505092915050565b8035602083101561022157600019602084900360031b1b1692915050565b818382376000910190815291905056fea2646970667358221220e961f8992a129634c5841f6f8ff7eac208b6822d2646363c613c0f46bcd65a0b64736f6c63430008170033" as const;