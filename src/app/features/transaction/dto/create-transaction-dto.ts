export interface CreateTransactionDto {
  type: string;
  payload: unknown;
  publicKey: string;
  signature: string;
  nonce: string;
}
