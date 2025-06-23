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
    "name": "afterHookCallCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
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
    "name": "beforeHookCallCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b5061028c806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e33146100675780637c46d3c814610083578063a145832a1461009e578063d3eddcc5146100b1578063e38ad590146100c4578063ed46336714610067575b600080fd5b610081610075366004610162565b50505050505050505050565b005b61008c60015481565b60405190815260200160405180910390f35b6100816100ac366004610162565b6100cd565b6100816100bf366004610162565b6100ed565b61008c60005481565b6000805490806100dc8361022f565b919050555050505050505050505050565b600180549060006100dc8361022f565b60008083601f84011261010f57600080fd5b50813567ffffffffffffffff81111561012757600080fd5b60208301915083602082850101111561013f57600080fd5b9250929050565b80356001600160a01b038116811461015d57600080fd5b919050565b60008060008060008060008060008060e08b8d03121561018157600080fd5b8a3567ffffffffffffffff8082111561019957600080fd5b6101a58e838f016100fd565b909c509a5060208d01359150808211156101be57600080fd5b6101ca8e838f016100fd565b909a50985060408d0135975060608d01359150808211156101ea57600080fd5b506101f78d828e016100fd565b90965094505060808b0135925061021060a08c01610146565b915061021e60c08c01610146565b90509295989b9194979a5092959850565b60006001820161024f57634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220fbb59fec9ec7bf6cdda251d9d498ff456d0623f22ca1f4ef5f02ab03744fc44c64736f6c63430008170033" as const;