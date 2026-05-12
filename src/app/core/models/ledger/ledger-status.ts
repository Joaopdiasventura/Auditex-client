export interface LedgerStatus {
  valid: boolean;
  blocksCount: number;
  pendingTransactions: number;
  minedTransactions: number;
  latestBlockIndex: number | null;
  latestBlockHash: string | null;
  lastMinedAt: string | null;
}
