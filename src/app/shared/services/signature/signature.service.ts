import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignatureService {
  async sign(data: string, privateKeyBase64: string): Promise<string> {
    const privateKey = await this.importPrivateKey(privateKeyBase64);
    const encodedData = new TextEncoder().encode(data);
    const dataBuffer = this.uint8ArrayToArrayBuffer(encodedData);

    const signature = await crypto.subtle.sign(
      {
        name: 'RSASSA-PKCS1-v1_5',
      },
      privateKey,
      dataBuffer,
    );

    return this.arrayBufferToBase64(signature);
  }

  private async importPrivateKey(privateKeyBase64: string): Promise<CryptoKey> {
    const keyBuffer = this.base64ToArrayBuffer(privateKeyBase64);

    return crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign'],
    );
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index++) {
      bytes[index] = binary.charCodeAt(index);
    }

    return this.uint8ArrayToArrayBuffer(bytes);
  }

  private uint8ArrayToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    const buffer = new ArrayBuffer(bytes.byteLength);
    const view = new Uint8Array(buffer);

    view.set(bytes);

    return buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary);
  }
}
