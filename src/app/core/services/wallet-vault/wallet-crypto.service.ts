import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WalletCryptoService {
  private readonly iterations = 250000;

  async encryptPrivateKey(
    privateKey: string,
    password: string,
  ): Promise<{
    encryptedPrivateKey: string;
    salt: string;
    iv: string;
    iterations: number;
  }> {
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    const ivBytes = crypto.getRandomValues(new Uint8Array(12));

    const salt = this.uint8ArrayToArrayBuffer(saltBytes);
    const iv = this.uint8ArrayToArrayBuffer(ivBytes);

    const key = await this.deriveKey(password, salt);
    const encodedPrivateKey = this.uint8ArrayToArrayBuffer(new TextEncoder().encode(privateKey));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encodedPrivateKey,
    );

    return {
      encryptedPrivateKey: this.arrayBufferToBase64(encrypted),
      salt: this.arrayBufferToBase64(salt),
      iv: this.arrayBufferToBase64(iv),
      iterations: this.iterations,
    };
  }

  async decryptPrivateKey(
    encryptedPrivateKey: string,
    password: string,
    saltBase64: string,
    ivBase64: string,
    iterations: number,
  ): Promise<string> {
    const salt = this.base64ToArrayBuffer(saltBase64);
    const iv = this.base64ToArrayBuffer(ivBase64);
    const key = await this.deriveKey(password, salt, iterations);
    const encrypted = this.base64ToArrayBuffer(encryptedPrivateKey);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encrypted,
    );

    return new TextDecoder().decode(decrypted);
  }

  private async deriveKey(
    password: string,
    salt: ArrayBuffer,
    iterations = this.iterations,
  ): Promise<CryptoKey> {
    const encodedPassword = new TextEncoder().encode(password);
    const passwordBuffer = this.uint8ArrayToArrayBuffer(encodedPassword);

    const baseKey = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, [
      'deriveKey',
    ]);

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256',
      },
      baseKey,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    for (const byte of bytes) binary += String.fromCharCode(byte);

    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);

    return this.uint8ArrayToArrayBuffer(bytes);
  }

  private uint8ArrayToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    const buffer = new ArrayBuffer(bytes.byteLength);
    const view = new Uint8Array(buffer);

    view.set(bytes);

    return buffer;
  }
}
