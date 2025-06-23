export const abi = [
  {
    "type": "function",
    "name": "computeAddress",
    "inputs": [
      {
        "name": "_bytecodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_salt",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "addr_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "deploy",
    "inputs": [
      {
        "name": "_bytecode",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_salt",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "addr_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Deployed",
    "inputs": [
      {
        "name": "addr",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "Create2EmptyBytecode",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Create2FailedDeployment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Create2InsufficientBalance",
    "inputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "SimpleFactoryEmptyContract",
    "inputs": [
      {
        "name": "deployed",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b506102ef806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063481286e61461003b5780634af63f021461006a575b600080fd5b61004e6100493660046101cc565b61007d565b6040516001600160a01b03909116815260200160405180910390f35b61004e610078366004610204565b610090565b60006100898284610115565b9392505050565b600061009e60008385610122565b9050806001600160a01b03163b6000036100db576040516301e3495560e61b81526001600160a01b03821660048201526024015b60405180910390fd5b6040516001600160a01b038216907ff40fcec21964ffb566044d083b4073f29f7f7929110ea19e1b3ebe375d89055e90600090a292915050565b60006100898383306101a2565b60008347101561014e5760405163392efb2b60e21b8152476004820152602481018590526044016100d2565b815160000361017057604051631328927760e21b815260040160405180910390fd5b8282516020840186f590506001600160a01b03811661008957604051633a0ba96160e11b815260040160405180910390fd5b6000604051836040820152846020820152828152600b8101905060ff815360559020949350505050565b600080604083850312156101df57600080fd5b50508035926020909101359150565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561021757600080fd5b823567ffffffffffffffff8082111561022f57600080fd5b818501915085601f83011261024357600080fd5b813581811115610255576102556101ee565b604051601f8201601f19908116603f0116810190838211818310171561027d5761027d6101ee565b8160405282815288602084870101111561029657600080fd5b82602086016020830137600060209382018401529896909101359650505050505056fea264697066735822122060b446de0182f6cf23546703f0e9eb0c1da6c4f00138f5d151474f865157cd3164736f6c63430008170033" as const;