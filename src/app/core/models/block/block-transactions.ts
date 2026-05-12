import { PageResponse } from '../page/page-response';
import { Transaction } from '../transaction/transaction';
import { Block } from './block';

export interface BlockTransactions {
  block: Block;
  transactions: PageResponse<Transaction>;
}
