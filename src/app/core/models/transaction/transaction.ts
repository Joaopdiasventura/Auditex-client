import { TransactionStatus } from "../../enums/transaction/transaction-status";

export interface Transaction {
  id: string;
  hash: string;
  type: string;
  payload: unknown;
  publicKey: string;
  signature: string;
  status: TransactionStatus;
  nonce: string;
  createdAt: string;
  minedAt: string | null;
  blockId: string | null;
  blockTransactionIndex: number | null;
}
