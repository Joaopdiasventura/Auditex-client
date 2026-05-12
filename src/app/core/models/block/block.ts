export interface Block {
  id: string;
  index: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  nonce: number;
  difficulty: number;
  createdAt: string;
  minedAt: string;
  transactionsCount: number;
}
