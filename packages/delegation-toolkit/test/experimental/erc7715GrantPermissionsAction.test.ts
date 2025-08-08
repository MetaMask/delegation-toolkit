import { stub } from 'sinon';
import type { Account, Client } from 'viem';
import { createClient, custom } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { beforeEach, describe, expect, it } from 'vitest';

import { erc7715ProviderActions } from '../../src/experimental';
import {
  erc7715GrantPermissionsAction,
  GrantPermissionsParameters,
} from '../../src/experimental/erc7715GrantPermissionsAction';
import { ensureSnapsAuthorized } from '../../src/experimental/snapsAuthorization';
import {
  AccountSigner,
  Erc20TokenPeriodicPermission,
  Erc20TokenStreamPermission,
  NativeTokenPeriodicPermission,
  NativeTokenStreamPermission,
  PermissionRequest,
  PermissionResponse,
  PermissionTypes,
} from '@metamask/permission-types';

describe('erc7715GrantPermissionsAction', () => {
  let alice: Account;
  let bob: Account;

  const stubRequest = stub();
  const mockClient: Client = {
    request: stubRequest,
  } as unknown as Client;

  beforeEach(async () => {
    alice = privateKeyToAccount(generatePrivateKey());
    bob = privateKeyToAccount(generatePrivateKey());

    stubRequest.reset();
  });

  describe('erc7715GrantPermissionsAction()', () => {
    it('should set retryCount to 0', async () => {
      const parameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              maxAmount: 2,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[1]).to.deep.equal({
        retryCount: 0,
      });
    });

    it('should throw an error when amountPerSecond is undefined', async () => {
      const parameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: undefined as any,
              maxAmount: 2,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await expect(
        erc7715GrantPermissionsAction(mockClient, parameters),
      ).rejects.toThrow('Invalid parameters: amountPerSecond is required');
    });

    it("doesn't throw error when justification is undefined", async () => {
      const parameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              maxAmount: 2,
              startTime: 2,
              justification: undefined as any,
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await expect(
        erc7715GrantPermissionsAction(mockClient, parameters),
      ).resolves.not.toThrow();
    });

    it('should format native-token-stream permission request correctly', async () => {
      const parameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              maxAmount: 2,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                permission: {
                  type: 'native-token-stream',
                  data: {
                    amountPerSecond: '0x1',
                    maxAmount: '0x2',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                  isAdjustmentAllowed: false,
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      expiry: 1234567890,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('should throw an error when result is null', async () => {
      stubRequest.resolves(null);

      const parameters = [
        {
          chainId: 31337,
          expiry: Math.floor(Date.now() / 1000) + 3600,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              maxAmount: 2,
              startTime: 1,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await expect(
        erc7715GrantPermissionsAction(mockClient, parameters),
      ).rejects.toThrow('Failed to grant permissions');
    });

    it('should use the default snap ID if not provided', async () => {
      stubRequest.resolves([
        {
          chainId: '0x7b27',
          expiry: 1234567890,
          permission: {
            type: 'basic-permission',
            data: { foo: 'bar' },
          },
          signer: alice.address,
          context: '0x123456',
        },
      ]);

      const parameters = [
        {
          chainId: 31337,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0].params.snapId).to.equal(
        'npm:@metamask/permissions-kernel-snap',
      );
    });

    it('should use a custom snap ID if provided', async () => {
      const customKernelId = 'npm:@metamask/custom-snap';
      stubRequest.resolves([
        {
          chainId: '0x7b27',
          expiry: 1234567890,
          permission: {
            type: 'basic-permission',
            data: { foo: 'bar' },
          },
          signer: alice.address,
          context: '0x123456',
        },
      ]);

      const parameters = [
        {
          chainId: 31337,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(
        mockClient,
        parameters,
        customKernelId,
      );

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0].params.snapId).to.equal(
        customKernelId,
      );
    });

    it('should handle multiple permission requests', async () => {
      const permissionsResponse: PermissionResponse<
        AccountSigner,
        PermissionTypes
      >[] = [
        {
          chainId: '0x7b27',
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: true,
              data: { expiry: 1234567890 },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: true,
            data: {
              amountPerSecond: '0x1',
              justification: 'Test justification',
            },
          },
          signer: {
            type: 'account',
            data: {
              address: alice.address,
            },
          },
          context: '0x123456',
          dependencyInfo: [],
        },
        {
          chainId: '0x7b27',
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: true,
              data: { expiry: 1234567890 },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: true,
            data: {
              amountPerSecond: '0x2',
              justification: 'Test justification 2',
            },
          },
          signer: {
            type: 'account',
            data: {
              address: alice.address,
            },
          },
          context: '0x654321',
          dependencyInfo: [],
        },
      ];
      stubRequest.resolves(permissionsResponse);

      const parameters: GrantPermissionsParameters = [
        {
          chainId: 31337,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
        {
          chainId: 31337,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: bob.address,
        },
      ];

      const result = await erc7715GrantPermissionsAction(
        mockClient,
        parameters,
      );

      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.equal(permissionsResponse);
    });

    it('should not specify isAdjustmentAllowed when not specified in the request', async () => {
      const parameters: GrantPermissionsParameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              maxAmount: 2,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                permission: {
                  type: 'native-token-stream',
                  data: {
                    amountPerSecond: '0x1',
                    maxAmount: '0x2',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                  isAdjustmentAllowed: false,
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      expiry: 1234567890,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('should allow maxAmount to be excluded from the request', async () => {
      const parameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                permission: {
                  type: 'native-token-stream',
                  data: {
                    amountPerSecond: '0x1',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                  isAdjustmentAllowed: false,
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      expiry: 1234567890,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('should allow maxAmount to be null in the request', async () => {
      const parameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              maxAmount: null as any,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                permission: {
                  type: 'native-token-stream',
                  data: {
                    amountPerSecond: '0x1',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                  isAdjustmentAllowed: false,
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      expiry: 1234567890,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('should accept numerical values as hex for startTime', async () => {
      const parameters: GrantPermissionsParameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              maxAmount: 2,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                permission: {
                  type: 'native-token-stream',
                  data: {
                    amountPerSecond: '0x1',
                    maxAmount: '0x2',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                  isAdjustmentAllowed: false,
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      expiry: 1234567890,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('formats Native Token Stream correctly', async () => {
      const parameters: GrantPermissionsParameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream',
            data: {
              amountPerSecond: 0x1n,
              maxAmount: 2,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: true,
          signer: alice.address,
        } as const,
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      const expectedRequest: PermissionRequest<
        AccountSigner,
        NativeTokenStreamPermission
      > = {
        chainId: '0x7a69',
        address: bob.address,
        permission: {
          type: 'native-token-stream',
          data: {
            amountPerSecond: '0x1',
            maxAmount: '0x2',
            startTime: 2,
            justification: 'Test justification',
          },
          isAdjustmentAllowed: true,
        },
        signer: {
          type: 'account',
          data: {
            address: alice.address,
          },
        },
        rules: [
          {
            type: 'expiry',
            isAdjustmentAllowed: true,
            data: {
              expiry: 1234567890,
            },
          },
        ],
      };

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [expectedRequest],
          },
        },
      });
    });

    it('formats Erc20 Token Stream correctly', async () => {
      const parameters: GrantPermissionsParameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'erc20-token-stream',
            data: {
              tokenAddress: '0x1',
              amountPerSecond: 0x1n,
              maxAmount: 2,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: true,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      const expectedRequest: PermissionRequest<
        AccountSigner,
        Erc20TokenStreamPermission
      > = {
        chainId: '0x7a69',
        address: bob.address,
        permission: {
          type: 'erc20-token-stream',
          data: {
            tokenAddress: '0x1',
            amountPerSecond: '0x1',
            maxAmount: '0x2',
            startTime: 2,
            justification: 'Test justification',
          },
          isAdjustmentAllowed: true,
        },
        signer: {
          type: 'account',
          data: {
            address: alice.address,
          },
        },
        rules: [
          {
            type: 'expiry',
            isAdjustmentAllowed: true,
            data: {
              expiry: 1234567890,
            },
          },
        ],
      };

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [expectedRequest],
          },
        },
      });
    });

    it('formats Native Token Periodic correctly', async () => {
      const parameters: GrantPermissionsParameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-periodic' as const,
            data: {
              periodAmount: 0x5n,
              periodDuration: 60,
              startTime: 1000,
              justification: 'Periodic native token test',
            },
          },
          isAdjustmentAllowed: true,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      const expectedRequest: PermissionRequest<
        AccountSigner,
        NativeTokenPeriodicPermission
      > = {
        chainId: '0x7a69',
        address: bob.address,
        permission: {
          type: 'native-token-periodic',
          data: {
            periodAmount: '0x5',
            periodDuration: 60,
            startTime: 1000,
            justification: 'Periodic native token test',
          },
          isAdjustmentAllowed: true,
        },
        signer: {
          type: 'account',
          data: {
            address: alice.address,
          },
        },
        rules: [
          {
            type: 'expiry',
            isAdjustmentAllowed: true,
            data: {
              expiry: 1234567890,
            },
          },
        ],
      };

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [expectedRequest],
          },
        },
      });
    });

    it('formats Erc20 Token Periodic correctly', async () => {
      const parameters: GrantPermissionsParameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'erc20-token-periodic' as const,
            data: {
              tokenAddress: '0x2',
              periodAmount: 0x10n,
              periodDuration: 120,
              startTime: 2000,
              justification: 'Periodic erc20 token test',
            },
          },
          isAdjustmentAllowed: true,
          signer: alice.address,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      const expectedRequest: PermissionRequest<
        AccountSigner,
        Erc20TokenPeriodicPermission
      > = {
        chainId: '0x7a69',
        address: bob.address,
        permission: {
          type: 'erc20-token-periodic',
          data: {
            tokenAddress: '0x2',
            periodAmount: '0x10',
            periodDuration: 120,
            startTime: 2000,
            justification: 'Periodic erc20 token test',
          },
          isAdjustmentAllowed: true,
        },
        signer: {
          type: 'account',
          data: {
            address: alice.address,
          },
        },
        rules: [
          {
            type: 'expiry',
            isAdjustmentAllowed: true,
            data: {
              expiry: 1234567890,
            },
          },
        ],
      };

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [expectedRequest],
          },
        },
      });
    });
  });

  describe('erc7715ProviderActions integration', () => {
    const allSnapsEnabledResponse = {
      'npm:@metamask/permissions-kernel-snap': {
        version: '1.0.0',
        id: 'npm:@metamask/permissions-kernel-snap',
        enabled: true,
        blocked: false,
      },
      'npm:@metamask/gator-permissions-snap': {
        version: '1.0.0',
        id: 'npm:@metamask/gator-permissions-snap',
        enabled: true,
        blocked: false,
      },
    };

    beforeEach(() => {
      stubRequest.onFirstCall().resolves(allSnapsEnabledResponse);
    });

    it('should extend the client with erc7715 actions', async () => {
      const client = createClient({
        transport: custom({
          request: stubRequest,
        }),
      }).extend(erc7715ProviderActions());

      expect(client).to.have.property('grantPermissions');

      const parameters: GrantPermissionsParameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];
      await client.grantPermissions(parameters);

      expect(stubRequest.callCount).to.equal(2);

      expect(stubRequest.secondCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                permission: {
                  type: 'native-token-stream',
                  data: {
                    amountPerSecond: '0x1',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                  isAdjustmentAllowed: false,
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      expiry: 1234567890,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('should wait for the snaps to be authorized', async () => {
      const client = createClient({
        transport: custom({
          request: stubRequest,
        }),
      }).extend(erc7715ProviderActions());

      let resolveSnapsPromise: (value: unknown) => void = () => {
        throw new Error('resolveSnapsPromise not set');
      };

      const snapsPromise = new Promise((resolve) => {
        resolveSnapsPromise = resolve;
      });

      stubRequest.onFirstCall().returns(snapsPromise);

      const parameters = [
        {
          chainId: 31337,
          address: bob.address,
          expiry: 1234567890,
          permission: {
            type: 'native-token-stream' as const,
            data: {
              amountPerSecond: 0x1n,
              startTime: 2,
              justification: 'Test justification',
            },
          },
          isAdjustmentAllowed: false,
          signer: alice.address,
        },
      ];

      const grantPromise = client.grantPermissions(parameters);

      // just let the event loop cycle
      await new Promise((resolve) => setImmediate(resolve));

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_getSnaps',
        params: {},
      });

      // Resolve the snaps check with authorized snaps
      resolveSnapsPromise?.(allSnapsEnabledResponse);

      // Wait for the grant permissions operation to complete
      await grantPromise;

      // Verify the second call was made to grant permissions
      expect(stubRequest.callCount).to.equal(2);
      expect(stubRequest.secondCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_requestExecutionPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                permission: {
                  type: 'native-token-stream',
                  data: {
                    amountPerSecond: '0x1',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                  isAdjustmentAllowed: false,
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      expiry: 1234567890,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });
  });

  describe('ensureSnapsAuthorized()', () => {
    const client = createClient({
      transport: custom({
        request: stubRequest,
      }),
    }).extend(erc7715ProviderActions());

    it('should return true if both snaps are authorized', async () => {
      stubRequest.resolves({
        'npm:@metamask/permissions-kernel-snap': {
          version: '1.0.0',
          id: 'npm:@metamask/permissions-kernel-snap',
          enabled: true,
          blocked: false,
        },
        'npm:@metamask/gator-permissions-snap': {
          version: '1.0.0',
          id: 'npm:@metamask/gator-permissions-snap',
          enabled: true,
          blocked: false,
        },
      });

      const res = await ensureSnapsAuthorized(client);

      expect(res).to.equal(true);

      expect(stubRequest.callCount).to.equal(1);

      expect(stubRequest.firstCall.args).to.deep.equal([
        {
          method: 'wallet_getSnaps',
          params: {},
        },
      ]);
    });

    it('should return true if both specified snaps are enabled', async () => {
      const kernelSnapId = 'custom-kernel-id';
      const providerSnapId = 'custom-provider-id';
      stubRequest.resolves({
        [kernelSnapId]: {
          version: '1.0.0',
          id: kernelSnapId,
          enabled: true,
          blocked: false,
        },
        [providerSnapId]: {
          version: '1.0.0',
          id: providerSnapId,
          enabled: true,
          blocked: false,
        },
      });

      const res = await ensureSnapsAuthorized(client, {
        kernelSnapId,
        providerSnapId,
      });

      expect(res).to.equal(true);

      expect(stubRequest.callCount).to.equal(1);
    });

    it('should return false if permissions kernel snap is not enabled', async () => {
      stubRequest.resolves({
        'npm:@metamask/permissions-kernel-snap': {
          version: '1.0.0',
          id: 'npm:@metamask/permissions-kernel-snap',
          enabled: false,
          blocked: false,
        },
        'npm:@metamask/gator-permissions-snap': {
          version: '1.0.0',
          id: 'npm:@metamask/gator-permissions-snap',
          enabled: true,
          blocked: false,
        },
      });

      const res = await ensureSnapsAuthorized(client);

      expect(res).to.equal(false);
    });

    it('should return false if permissions provider snap is not enabled', async () => {
      stubRequest.resolves({
        'npm:@metamask/permissions-kernel-snap': {
          version: '1.0.0',
          id: 'npm:@metamask/permissions-kernel-snap',
          enabled: false,
          blocked: false,
        },
        'npm:@metamask/gator-permissions-snap': {
          version: '1.0.0',
          id: 'npm:@metamask/gator-permissions-snap',
          enabled: true,
          blocked: false,
        },
      });

      const res = await ensureSnapsAuthorized(client);

      expect(res).to.equal(false);
    });

    it('should return false if both snaps are not enabled', async () => {
      stubRequest.resolves({
        'npm:@metamask/permissions-kernel-snap': {
          version: '1.0.0',
          id: 'npm:@metamask/permissions-kernel-snap',
          enabled: false,
          blocked: false,
        },
        'npm:@metamask/gator-permissions-snap': {
          version: '1.0.0',
          id: 'npm:@metamask/gator-permissions-snap',
          enabled: false,
          blocked: false,
        },
      });

      const res = await ensureSnapsAuthorized(client);

      expect(res).to.equal(false);
    });

    it('should return false if both snaps are blocked', async () => {
      stubRequest.resolves({
        'npm:@metamask/permissions-kernel-snap': {
          version: '1.0.0',
          id: 'npm:@metamask/permissions-kernel-snap',
          enabled: true,
          blocked: true,
        },
        'npm:@metamask/gator-permissions-snap': {
          version: '1.0.0',
          id: 'npm:@metamask/gator-permissions-snap',
          enabled: true,
          blocked: true,
        },
      });

      const res = await ensureSnapsAuthorized(client);

      expect(res).to.equal(false);
    });
  });
});
