import type { Account, Chain, Client, Transport } from 'viem';

// Simplified struct for a P256 owner of a HybridDeleGator
export type P256Owner = {
  keyId: string;
  x: bigint;
  y: bigint;
};

export type InitializedClient = Client<Transport, Chain, Account>;
