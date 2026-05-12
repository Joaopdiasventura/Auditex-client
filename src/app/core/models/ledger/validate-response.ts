export interface ValidateResponse {
  valid: boolean;
  blocksChecked: number;
  transactionsChecked: number;
  brokenAtBlock: string | null;
  brokenAtTransaction: string | null;
  reason: string | null;
}
