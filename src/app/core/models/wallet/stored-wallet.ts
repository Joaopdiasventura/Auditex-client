import { Wallet } from './wallet';

export interface StoredWallet extends Wallet {
  encryptedPrivateKey: string;
  salt: string;
  iv: string;
  kdf: 'PBKDF2';
  iterations: number;
}
