import { Injectable, inject } from '@angular/core';
import { WalletCryptoService } from './wallet-crypto.service';
import { ReturnWalletDto } from '../../../features/wallet/dto/return-wallet-dto';
import { StoredWallet } from '../../models/wallet/stored-wallet';

@Injectable({
  providedIn: 'root',
})
export class WalletVaultService {
  private readonly databaseName = 'auditex-wallet-vault';
  private readonly storeName = 'wallets';
  private readonly version = 1;
  private readonly walletCryptoService = inject(WalletCryptoService);

  public async save(wallet: ReturnWalletDto, password: string): Promise<StoredWallet> {
    const encrypted = await this.walletCryptoService.encryptPrivateKey(wallet.privateKey, password);

    const storedWallet: StoredWallet = {
      id: wallet.id,
      ownerName: wallet.ownerName,
      address: wallet.address,
      publicKey: wallet.publicKey,
      encryptedPrivateKey: encrypted.encryptedPrivateKey,
      salt: encrypted.salt,
      iv: encrypted.iv,
      kdf: 'PBKDF2',
      iterations: encrypted.iterations,
      createdAt: wallet.createdAt,
    };

    const database = await this.openDatabase();

    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(storedWallet);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    database.close();

    return storedWallet;
  }

  public async findAll(): Promise<StoredWallet[]> {
    const database = await this.openDatabase();

    const result = await new Promise<StoredWallet[]>((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as StoredWallet[]);
      request.onerror = () => reject(request.error);
    });

    database.close();

    return result;
  }

  public async findByAddress(address: string): Promise<StoredWallet | null> {
    const database = await this.openDatabase();

    const result = await new Promise<StoredWallet | null>((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(address);

      request.onsuccess = () => resolve((request.result as StoredWallet) ?? null);
      request.onerror = () => reject(request.error);
    });

    database.close();

    return result;
  }

  public async deleteByAddress(address: string): Promise<void> {
    const database = await this.openDatabase();

    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(address);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    database.close();
  }

  public async decryptPrivateKey(wallet: StoredWallet, password: string): Promise<string> {
    return this.walletCryptoService.decryptPrivateKey(
      wallet.encryptedPrivateKey,
      password,
      wallet.salt,
      wallet.iv,
      wallet.iterations,
    );
  }

  public async saveImported(wallet: ReturnWalletDto, password: string): Promise<StoredWallet> {
    const encrypted = await this.walletCryptoService.encryptPrivateKey(wallet.privateKey, password);

    const storedWallet: StoredWallet = {
      id: wallet.id,
      ownerName: wallet.ownerName,
      address: wallet.address,
      publicKey: wallet.publicKey,
      encryptedPrivateKey: encrypted.encryptedPrivateKey,
      salt: encrypted.salt,
      iv: encrypted.iv,
      kdf: 'PBKDF2',
      iterations: encrypted.iterations,
      createdAt: wallet.createdAt,
    };

    const database = await this.openDatabase();

    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(storedWallet);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    database.close();

    return storedWallet;
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, this.version);

      request.onupgradeneeded = () => {
        const database = request.result;

        if (!database.objectStoreNames.contains(this.storeName)) {
          database.createObjectStore(this.storeName, {
            keyPath: 'address',
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
