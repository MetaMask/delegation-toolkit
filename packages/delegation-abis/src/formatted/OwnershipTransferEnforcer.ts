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
        "name": "targetContract_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "event",
    "name": "OwnershipTransferEnforced",
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
        "name": "newOwner",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b506106af806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a36600461049f565b50505050505050505050565b005b61007661008636600461049f565b6100ba565b61009e61009936600461056c565b6101e7565b6040516001600160a01b03909116815260200160405180910390f35b856100c6816000610252565b6101175760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b610128816000610252565b6101825760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b606482015260840161010e565b5060006101918d8d8a8a610269565b6040516001600160a01b038083168252919250879186169033907f0f026cada0b544ae1cc47ac006f1f4c3d7e94832af22aa0065351de49f9284d79060200160405180910390a450505050505050505050505050565b60006014821461023e5760405162461bcd60e51b815260206004820152602e602482015260008051602061065a83398151915260448201526d0c85ae8cae4dae65ad8cadccee8d60931b606482015260840161010e565b61024882846105ae565b60601c9392505050565b6001600160f81b0319828116908216145b92915050565b60008036600061027986866103e9565b929550935090915050602481146102db5760405162461bcd60e51b8152602060048201526032602482015260008051602061065a8339815191526044820152710c85acaf0cac6eae8d2dedc5ad8cadccee8d60731b606482015260840161010e565b60006102ea60048284866105e3565b6102f39161060d565b90506001600160e01b0319811663f2fde38b60e01b146103545760405162461bcd60e51b8152602060048201526028602482015260008051602061065a833981519152604482015267190b5b595d1a1bd960c21b606482015260840161010e565b60006103608a8a6101e7565b9050846001600160a01b0316816001600160a01b0316146103c45760405162461bcd60e51b815260206004820152602a602482015260008051602061065a833981519152604482015269190b58dbdb9d1c9858dd60b21b606482015260840161010e565b6103d26024600485876105e3565b6103db9161063b565b9a9950505050505050505050565b60008036816103fb60148287896105e3565b610404916105ae565b60601c93506104176034601487896105e3565b6104209161063b565b925061042f85603481896105e3565b949793965094505050565b60008083601f84011261044c57600080fd5b50813567ffffffffffffffff81111561046457600080fd5b60208301915083602082850101111561047c57600080fd5b9250929050565b80356001600160a01b038116811461049a57600080fd5b919050565b60008060008060008060008060008060e08b8d0312156104be57600080fd5b8a3567ffffffffffffffff808211156104d657600080fd5b6104e28e838f0161043a565b909c509a5060208d01359150808211156104fb57600080fd5b6105078e838f0161043a565b909a50985060408d0135975060608d013591508082111561052757600080fd5b506105348d828e0161043a565b90965094505060808b0135925061054d60a08c01610483565b915061055b60c08c01610483565b90509295989b9194979a5092959850565b6000806020838503121561057f57600080fd5b823567ffffffffffffffff81111561059657600080fd5b6105a28582860161043a565b90969095509350505050565b6bffffffffffffffffffffffff1981358181169160148510156105db5780818660140360031b1b83161692505b505092915050565b600080858511156105f357600080fd5b8386111561060057600080fd5b5050820193919092039150565b6001600160e01b031981358181169160048510156105db5760049490940360031b84901b1690921692915050565b8035602083101561026357600019602084900360031b1b169291505056fe4f776e6572736869705472616e73666572456e666f726365723a696e76616c69a2646970667358221220ca5ae6d7f1b90ba5d22d1aa6d07431cba5451fcdcfda2c53ba5014e9bf6c30cc64736f6c63430008170033" as const;