import {
  EIP7702StatelessDeleGator,
  HybridDeleGator,
  MultiSigDeleGator,
} from '@metamask/delegation-abis';
import { type Address, type Hex } from 'viem';
import {
  entryPoint07Abi,
  toPackedUserOperation,
  toSmartAccount,
} from 'viem/account-abstraction';

import { isValidImplementation } from './actions/isValidImplementation';
import { Implementation } from './constants';
import { getCounterfactualAccountData } from './counterfactualAccountData';
import {
  SIGNABLE_DELEGATION_TYPED_DATA,
  toDelegationStruct,
} from './delegation';
import { entryPointGetNonce as _getNonce } from './DelegationFramework/EntryPoint/read';
import { getDeleGatorEnvironment } from './delegatorEnvironment';
import { encodeCallsForCaller } from './encodeCalls';
import { resolveSignatory } from './signatory';
import type {
  Call,
  ToMetaMaskSmartAccountParameters,
  ToMetaMaskSmartAccountReturnType,
  SignDelegationParams,
  SignUserOperationParams,
  AbiByImplementation,
} from './types';
import { SIGNABLE_USER_OP_TYPED_DATA } from './userOp';

const ENTRYPOINT_VERSION = '0.7' as const;

/**
 * Creates a MetaMask DeleGator smart account instance.
 *
 * @template TImplementation - The type of implementation, extending Implementation.
 * @param params - The parameters for creating the smart account.
 * @returns A promise that resolves to a MetaMask DeleGator smart account instance.
 * @description
 * This function sets up a MetaMask DeleGator smart account with the specified implementation.
 * It handles both deployed accounts, and counterfactual accounts.
 * A caller may specify a DeleGator environment, otherwise the environment will be inferred from the chain.
 */
export async function toMetaMaskSmartAccount<
  TImplementation extends Implementation,
>(
  params: ToMetaMaskSmartAccountParameters<TImplementation>,
): Promise<ToMetaMaskSmartAccountReturnType<TImplementation>> {
  const {
    client,
    client: { chain },
    implementation,
  } = params;

  if (!chain) {
    throw new Error('Chain not specified');
  }

  const signatory = resolveSignatory({
    implementation,
    signatory: params.signatory,
  });

  const environment = params.environment ?? getDeleGatorEnvironment(chain.id);

  let address: Address, factoryData: Hex | undefined;

  if (params.address) {
    factoryData = undefined;
    address = params.address;
  } else {
    if (implementation === Implementation.Stateless7702) {
      throw new Error('Stateless7702 does not support counterfactual accounts');
    }

    const accountData = await getCounterfactualAccountData({
      factory: environment.SimpleFactory,
      implementations: environment.implementations,
      implementation,
      deployParams: params.deployParams,
      deploySalt: params.deploySalt,
    });

    address = accountData.address;
    factoryData = accountData.factoryData;
  }

  const entryPoint = {
    abi: entryPoint07Abi,
    address: environment.EntryPoint,
    version: ENTRYPOINT_VERSION,
  } as const;

  const { abi, contractName } = {
    [Implementation.Hybrid]: {
      contractName: 'HybridDeleGator',
      abi: HybridDeleGator.abi,
    },
    [Implementation.MultiSig]: {
      contractName: 'MultiSigDeleGator',
      abi: MultiSigDeleGator.abi,
    },
    [Implementation.Stateless7702]: {
      contractName: 'EIP7702StatelessDeleGator',
      abi: EIP7702StatelessDeleGator.abi,
    },
  }[implementation] as {
    contractName: string;
    abi: AbiByImplementation[TImplementation];
  };

  const getFactoryArgs = async () => {
    if (factoryData === undefined) {
      throw new Error(
        'Deploy params were not provided, so factory args cannot be inferred',
      );
    }
    return {
      factoryData,
      factory: environment.SimpleFactory,
    };
  };

  const signDelegation = async (delegationParams: SignDelegationParams) => {
    const { delegation, chainId } = delegationParams;

    const delegationStruct = toDelegationStruct({
      ...delegation,
      signature: '0x',
    });

    const signature = signatory.signTypedData({
      domain: {
        chainId: chainId ?? chain.id,
        name: 'DelegationManager',
        version: '1',
        verifyingContract: environment.DelegationManager,
      },
      types: SIGNABLE_DELEGATION_TYPED_DATA,
      primaryType: 'Delegation',
      message: delegationStruct,
    });

    return signature;
  };

  const signUserOperation = async (userOpParams: SignUserOperationParams) => {
    const { chainId } = userOpParams;

    const packedUserOp = toPackedUserOperation({
      sender: address,
      ...userOpParams,
      signature: '0x',
    });

    const signature = await signatory.signTypedData({
      domain: {
        chainId: chainId ?? chain.id,
        name: contractName,
        version: '1',
        verifyingContract: address,
      },
      types: SIGNABLE_USER_OP_TYPED_DATA,
      primaryType: 'PackedUserOperation',
      message: { ...packedUserOp, entryPoint: entryPoint.address },
    });

    return signature;
  };

  const getAddress = async () => address;

  const getNonce = async () =>
    _getNonce({
      client,
      entryPoint: environment.EntryPoint,
      contractAddress: address,
      key: 0n,
    });

  const encodeCalls = async (calls: readonly Call[]) =>
    encodeCallsForCaller(address, calls);

  const smartAccount = await toSmartAccount({
    abi,
    client,
    entryPoint,
    environment,
    getAddress,
    getFactoryArgs,
    encodeCalls,
    getNonce,
    signUserOperation,
    signDelegation,
    ...signatory,
  });

  // Override isDeployed for all implementations to check proper implementation code
  return {
    ...smartAccount,
    isDeployed: async () =>
      isValidImplementation({
        client,
        accountAddress: address,
        implementation,
      }),
  };
}
