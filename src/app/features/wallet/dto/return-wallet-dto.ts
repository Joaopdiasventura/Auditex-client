import { Wallet } from '../../../core/models/wallet/wallet';

export interface ReturnWalletDto extends Wallet {
  privateKey: string;
}
