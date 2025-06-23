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
        "name": "blockAfterThreshold_",
        "type": "uint128",
        "internalType": "uint128"
      },
      {
        "name": "blockBeforeThreshold_",
        "type": "uint128",
        "internalType": "uint128"
      }
    ],
    "stateMutability": "pure"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b506104ed806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a366004610345565b50505050505050505050565b005b610076610086366004610345565b6100c2565b61009e610099366004610412565b61023e565b604080516001600160801b0393841681529290911660208301520160405180910390f35b85600881901b6001600160f81b03198116156101335760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b506000806101418d8d61023e565b90925090506001600160801b038216156101b957816001600160801b031643116101b95760405162461bcd60e51b8152602060048201526024808201527f426c6f636b4e756d626572456e666f726365723a6561726c792d64656c6567616044820152633a34b7b760e11b606482015260840161012a565b6001600160801b0381161561022f57806001600160801b0316431061022f5760405162461bcd60e51b815260206004820152602660248201527f426c6f636b4e756d626572456e666f726365723a657870697265642d64656c6560448201526533b0ba34b7b760d11b606482015260840161012a565b50505050505050505050505050565b600080602083146102a25760405162461bcd60e51b815260206004820152602860248201527f426c6f636b4e756d626572456e666f726365723a696e76616c69642d7465726d6044820152670e65ad8cadccee8d60c31b606482015260840161012a565b6102b0601060008587610454565b6102b99161047e565b60801c91506102cb8360108187610454565b6102d49161047e565b60801c90509250929050565b60008083601f8401126102f257600080fd5b50813567ffffffffffffffff81111561030a57600080fd5b60208301915083602082850101111561032257600080fd5b9250929050565b80356001600160a01b038116811461034057600080fd5b919050565b60008060008060008060008060008060e08b8d03121561036457600080fd5b8a3567ffffffffffffffff8082111561037c57600080fd5b6103888e838f016102e0565b909c509a5060208d01359150808211156103a157600080fd5b6103ad8e838f016102e0565b909a50985060408d0135975060608d01359150808211156103cd57600080fd5b506103da8d828e016102e0565b90965094505060808b013592506103f360a08c01610329565b915061040160c08c01610329565b90509295989b9194979a5092959850565b6000806020838503121561042557600080fd5b823567ffffffffffffffff81111561043c57600080fd5b610448858286016102e0565b90969095509350505050565b6000808585111561046457600080fd5b8386111561047157600080fd5b5050820193919092039150565b6fffffffffffffffffffffffffffffffff1981358181169160108510156104af5780818660100360031b1b83161692505b50509291505056fea2646970667358221220e786ddc75b5e54c089f23ff0a2c6c7b67417725b5021ebc3aa3b2726c852e6cb64736f6c63430008170033" as const;