import { expect } from 'chai';
import hre from 'hardhat';
import type { WalletClient } from 'viem';
import { concat, encodePacked, isAddress, pad, toHex } from 'viem';
import type { Address } from 'viem/accounts';
import { hardhat } from 'viem/chains';

import { createCaveatBuilder, CaveatBuilder } from '../../src/caveatBuilder';
import { BalanceChangeType } from '../../src/caveatBuilder/types';
import type { DeleGatorEnvironment } from '../../src/types';
import {
  randomAddress,
  randomBytes,
  setupDevelopmentEnvironment,
} from '../utils';

describe('createCaveatBuilder()', () => {
  const chain = hardhat;
  let environment: DeleGatorEnvironment;

  before(async () => {
    const [walletClient] = (await hre.viem.getWalletClients()) as [
      WalletClient,
    ];
    const publicClient = await hre.viem.getPublicClient();
    environment = await setupDevelopmentEnvironment(
      walletClient,
      publicClient,
      chain,
    );
  });

  describe('ctor', () => {
    it('should create a CaveatBuilder', () => {
      const builder = createCaveatBuilder(environment);

      expect(builder).to.be.instanceOf(CaveatBuilder);
    });

    it('should disallow empty caveats', () => {
      const builder = createCaveatBuilder(environment);

      expect(() => builder.build()).to.throw(
        'No caveats found. If you definitely want to create an empty caveat collection, set `allowEmptyCaveats`.',
      );
    });

    it('should allow empty caveats, when configured', () => {
      const builder = createCaveatBuilder(environment, {
        allowEmptyCaveats: true,
      });

      expect(() => builder.build()).to.not.throw();
    });
  });

  describe('individual caveat builders', () => {
    it("should add an 'allowedMethods' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const selectors = [randomBytes(4), randomBytes(4)];

      const caveats = builder.addCaveat('allowedMethods', selectors).build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.AllowedMethodsEnforcer,
          terms: concat(selectors),
          args: '0x',
        },
      ]);

      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }
      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add an 'allowedTargets' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const targets: [Address, Address] = [randomAddress(), randomAddress()];

      const caveats = builder.addCaveat('allowedTargets', targets).build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.AllowedTargetsEnforcer,
          terms: targets[0] + targets[1]?.slice(2),
          args: '0x',
        },
      ]);

      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add a 'deployed' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const contractAddress = randomAddress();
      const salt = randomBytes(32);
      const bytecode = randomBytes(256);

      const caveats = builder
        .addCaveat('deployed', contractAddress, salt, bytecode)
        .build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.DeployedEnforcer,
          terms: concat([contractAddress, pad(salt, { size: 32 }), bytecode]),
          args: '0x',
        },
      ]);

      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add an 'allowedCalldata' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const value = randomBytes(128);
      const startIndex = Math.floor(Math.random() * 2 ** 32);

      const caveats = builder
        .addCaveat('allowedCalldata', startIndex, value)
        .build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.AllowedCalldataEnforcer,
          terms: concat([toHex(startIndex, { size: 32 }), value]),
          args: '0x',
        },
      ]);

      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add an 'erc20BalanceChange' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const token = randomAddress();
      const recipient = randomAddress();
      const balance = BigInt(
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      );

      const caveats = builder
        .addCaveat(
          'erc20BalanceChange',
          token,
          recipient,
          balance,
          BalanceChangeType.Increase,
        )
        .build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.ERC20BalanceChangeEnforcer,
          terms: encodePacked(
            ['uint8', 'address', 'address', 'uint256'],
            [BalanceChangeType.Increase, token, recipient, balance],
          ),
          args: '0x',
        },
      ]);
      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add a 'valueLte' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const maxValue = BigInt(
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      );

      const caveats = builder.addCaveat('valueLte', maxValue).build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.ValueLteEnforcer,
          terms: toHex(maxValue, { size: 32 }),
          args: '0x',
        },
      ]);
      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add a 'limitedCalls' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const maxCalls = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      const caveats = builder.addCaveat('limitedCalls', maxCalls).build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.LimitedCallsEnforcer,
          terms: toHex(maxCalls, { size: 32 }),
          args: '0x',
        },
      ]);
      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add an 'id' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const id = BigInt(Math.floor(Math.random() * 2 ** 32));
      const caveats = builder.addCaveat('id', id).build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.IdEnforcer,
          terms: toHex(id, { size: 32 }),
          args: '0x',
        },
      ]);
      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add a 'nonce' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const nonce = randomBytes(16);
      const caveats = builder.addCaveat('nonce', nonce).build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.NonceEnforcer,
          terms: pad(nonce, { size: 32 }),
          args: '0x',
        },
      ]);
      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add a 'timestamp' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const after = 1000;
      const before = 2000;

      const caveats = builder.addCaveat('timestamp', after, before).build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.TimestampEnforcer,
          terms: concat([
            toHex(after, { size: 16 }),
            toHex(before, { size: 16 }),
          ]),
          args: '0x',
        },
      ]);
      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add a 'blockNumber' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const blockAfterThreshold = 1000n;
      const blockBeforeThreshold = 2000n;

      const caveats = builder
        .addCaveat('blockNumber', blockAfterThreshold, blockBeforeThreshold)
        .build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.BlockNumberEnforcer,
          terms: concat([
            toHex(blockAfterThreshold, { size: 16 }),
            toHex(blockBeforeThreshold, { size: 16 }),
          ]),
          args: '0x',
        },
      ]);
      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add a 'nativeTokenTransferAmount' caveat", () => {
      const builder = createCaveatBuilder(environment);
      const allowance = 1000000000000000000n; // 1 ETH in wei

      const caveats = builder
        .addCaveat('nativeTokenTransferAmount', allowance)
        .build();

      expect(caveats).to.deep.equal([
        {
          enforcer:
            environment.caveatEnforcers.NativeTokenTransferAmountEnforcer,
          terms: toHex(allowance, { size: 32 }),
          args: '0x',
        },
      ]);

      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add a 'nativeBalanceChange' caveat", () => {
      const builder = createCaveatBuilder(environment);
      const recipient = randomAddress();
      const minBalance = 500000000000000000n; // 0.5 ETH in wei

      const caveats = builder
        .addCaveat(
          'nativeBalanceChange',
          recipient,
          minBalance,
          BalanceChangeType.Increase,
        )
        .build();
      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.NativeBalanceChangeEnforcer,
          terms: encodePacked(
            ['uint8', 'address', 'uint256'],
            [BalanceChangeType.Increase, recipient, minBalance],
          ),
          args: '0x',
        },
      ]);

      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add a 'nativeTokenPayment' caveat", () => {
      const builder = createCaveatBuilder(environment);
      const amount = 1000000000000000000n; // 1 ETH in wei
      const recipient = randomAddress(true);

      const caveats = builder
        .addCaveat('nativeTokenPayment', recipient, amount)
        .build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.NativeTokenPaymentEnforcer,
          terms: concat([recipient, toHex(amount, { size: 32 })]),
          args: '0x',
        },
      ]);
      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });

    it("should add an 'erc20TransferAmount' caveat", () => {
      const builder = createCaveatBuilder(environment);

      const token = randomAddress();
      const amount = 2000n;

      const caveats = builder
        .addCaveat('erc20TransferAmount', token, amount)
        .build();

      expect(caveats).to.deep.equal([
        {
          enforcer: environment.caveatEnforcers.ERC20TransferAmountEnforcer,
          terms: concat([token, toHex(amount, { size: 32 })]),
          args: '0x',
        },
      ]);
      const caveat = caveats[0];
      if (!caveat) {
        throw new Error('caveat is not set');
      }

      expect(isAddress(caveat.enforcer)).to.equal(true);
    });
  });

  it("should add a 'redeemer' caveat", () => {
    const builder = createCaveatBuilder(environment);
    const redeemerAddress = randomAddress();

    const caveats = builder.addCaveat('redeemer', [redeemerAddress]).build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.RedeemerEnforcer,
        terms: redeemerAddress,
        args: '0x',
      },
    ]);
    const caveat = caveats[0];
    if (!caveat) {
      throw new Error('caveat is not set');
    }

    expect(isAddress(caveat.enforcer)).to.equal(true);
  });

  it("should add an 'argsEqualityCheck' caveat", () => {
    const builder = createCaveatBuilder(environment);
    const args = '0x1234567890';

    const caveats = builder.addCaveat('argsEqualityCheck', args).build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.ArgsEqualityCheckEnforcer,
        terms: args,
        args: '0x',
      },
    ]);
    const caveat = caveats[0];
    if (!caveat) {
      throw new Error('caveat is not set');
    }

    expect(isAddress(caveat.enforcer)).to.equal(true);
  });
});
