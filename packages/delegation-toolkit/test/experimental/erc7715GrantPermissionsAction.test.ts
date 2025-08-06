import type {
  AccountSigner,
  Hex,
  NativeTokenPeriodicPermission,
  NativeTokenStreamPermission,
} from '@metamask/permission-types';
import { stub } from 'sinon';
import type { Account, Client } from 'viem';
import { createClient, custom } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { beforeEach, describe, expect, it } from 'vitest';

import { erc7715ProviderActions } from '../../src/experimental';
import {
  ensureSnapsAuthorized,
  erc7715GrantPermissionsAction,
} from '../../src/experimental/erc7715GrantPermissionsAction';

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
    it('should format permissions request correctly', async () => {
      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              maxAmount: '0x2',
              startTime: 2,
              justification: 'Test justification',
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    maxAmount: '0x2',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
              },
            ],
          },
        },
      });
    });

    it('should set retryCount to 0', async () => {
      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              maxAmount: '0x2',
              startTime: 2,
              justification: 'Test justification',
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
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
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: undefined,
              maxAmount: '0x2',
              startTime: 2,
              justification: 'Test justification',
            },
          } as unknown as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
      ];

      await expect(
        erc7715GrantPermissionsAction(mockClient, parameters),
      ).rejects.toThrow('Invalid parameters: amountPerSecond is required');
    });

    it('should work when justification is undefined', async () => {
      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              maxAmount: '0x2',
              startTime: 2,
              justification: undefined,
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    maxAmount: '0x2',
                    startTime: 2,
                  },
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
              },
            ],
          },
        },
      });
    });

    it('should work when justification is null', async () => {
      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              maxAmount: '0x2',
              startTime: 2,
              justification: null,
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    maxAmount: '0x2',
                    startTime: 2,
                  },
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
              },
            ],
          },
        },
      });
    });

    it('should format native-token-stream permission request correctly', async () => {
      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              maxAmount: '0x2',
              startTime: 2,
              justification: 'Test justification',
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    maxAmount: '0x2',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
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
          chainId: '0x7a69' as Hex,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: Math.floor(Date.now() / 1000) + 3600,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              maxAmount: '0x2',
              startTime: 1,
              justification: 'Test justification',
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
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
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-periodic',
            data: { foo: 'bar' },
          },
          signer: alice.address,
          context: '0x123456',
        },
      ]);

      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-periodic',
            isAdjustmentAllowed: false,
            data: {
              periodAmount: '0x1',
              periodDuration: 1000,
            },
          } as NativeTokenPeriodicPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
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
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-periodic',
            data: { foo: 'bar' },
          },
          signer: alice.address,
          context: '0x123456',
        },
      ]);

      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-periodic',
            isAdjustmentAllowed: false,
            data: {
              periodAmount: '0x1',
              periodDuration: 1000,
            },
          } as NativeTokenPeriodicPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
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
      const permissionsResponse = [
        {
          chainId: '0x7b27',
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-periodic',
            data: { foo: 'bar' },
          },
          signer: alice.address,
          context: '0x123456',
        },
        {
          chainId: '0x7b27',
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-periodic',
            data: { foo: 'bar' },
          },
          signer: bob.address,
          context: '0x654321',
        },
      ];
      stubRequest.resolves(permissionsResponse);

      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-periodic',
            isAdjustmentAllowed: false,
            data: {
              periodAmount: '0x1',
              periodDuration: 1000,
            },
          } as NativeTokenPeriodicPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
        {
          chainId: '0x7a69' as Hex,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-periodic',
            isAdjustmentAllowed: false,
            data: {
              periodAmount: '0x1',
              periodDuration: 1000,
            },
          } as NativeTokenPeriodicPermission,
          signer: {
            type: 'account',
            data: { address: bob.address },
          } as AccountSigner,
        },
      ];

      const result = await erc7715GrantPermissionsAction(
        mockClient,
        parameters,
      );

      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.equal(permissionsResponse);
    });

    it('should not specify isAdjustmentAllowed when not specified in the permission', async () => {
      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              maxAmount: '0x2',
              startTime: 2,
              justification: 'Test justification',
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: {
              address: alice.address,
            },
          } as AccountSigner,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    maxAmount: '0x2',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
              },
            ],
          },
        },
      });
    });

    it('should allow maxAmount to be excluded from the request', async () => {
      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              startTime: 2,
              justification: 'Test justification',
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
              },
            ],
          },
        },
      });
    });

    it('should allow maxAmount to be null in the request', async () => {
      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              maxAmount: null,
              startTime: 2,
              justification: 'Test justification',
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
              },
            ],
          },
        },
      });
    });

    it('should accept (incorrectly) numerical values as hex', async () => {
      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              maxAmount: '0x2',
              startTime: '0x2',
              justification: 'Test justification',
            },
          } as unknown as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    maxAmount: '0x2',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                },

                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
              },
            ],
          },
        },
      });
    });

    it('should handle initialAmount in native-token-stream permission', async () => {
      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              initialAmount: '0x100',
              maxAmount: '0x2',
              startTime: 2,
              justification: 'Test justification',
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
      ];

      await erc7715GrantPermissionsAction(mockClient, parameters);

      expect(stubRequest.callCount).to.equal(1);
      expect(stubRequest.firstCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    initialAmount: '0x100',
                    maxAmount: '0x2',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                },
                signer: {
                  type: 'account',
                  data: {
                    address: alice.address,
                  },
                },
              },
            ],
          },
        },
      });
    });
  });

  describe('erc7715GrantPermissionsAction()', () => {
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

      const parameters = [
        {
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              startTime: 2,
              justification: 'Test justification',
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
        },
      ];
      await client.grantPermissions(parameters);

      expect(stubRequest.callCount).to.equal(2);

      expect(stubRequest.secondCall.args[0]).to.deep.equal({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:@metamask/permissions-kernel-snap',
          request: {
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                },
                signer: { type: 'account', data: { address: alice.address } },
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
          chainId: '0x7a69' as Hex,
          address: bob.address,
          rules: [
            {
              type: 'expiry',
              isAdjustmentAllowed: false,
              data: {
                timestamp: 1234567890,
              },
            },
          ],
          permission: {
            type: 'native-token-stream',
            isAdjustmentAllowed: false,
            data: {
              amountPerSecond: '0x1',
              startTime: 2,
              justification: 'Test justification',
            },
          } as NativeTokenStreamPermission,
          signer: {
            type: 'account',
            data: { address: alice.address },
          } as AccountSigner,
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
            method: 'wallet_grantPermissions',
            params: [
              {
                chainId: '0x7a69',
                address: bob.address,
                rules: [
                  {
                    type: 'expiry',
                    isAdjustmentAllowed: false,
                    data: {
                      timestamp: 1234567890,
                    },
                  },
                ],
                permission: {
                  type: 'native-token-stream',
                  isAdjustmentAllowed: false,
                  data: {
                    amountPerSecond: '0x1',
                    startTime: 2,
                    justification: 'Test justification',
                  },
                },
                signer: { type: 'account', data: { address: alice.address } },
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
