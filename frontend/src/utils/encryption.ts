/* src/utils/encryption.ts */

/**
 * Zero‑Knowledge Encryption utilities for the EHP frontend.
 * All encryption happens in the browser using the Web Crypto API, so the server never sees
 * plaintext data nor the secret key. The key is stored only in localStorage (or IndexedDB)
 * protected by a user‑provided passphrase.
 */

/**
 * Generate a cryptographically‑secure random AES‑GCM key.
 * The key is exported as a base64 string for storage.
 */
export async function generateKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const raw = await crypto.subtle.exportKey('raw', key);
  return bufferToBase64(raw);
}

/**
 * Import a base64‑encoded AES‑GCM key.
 */
export async function importKey(base64Key: string): Promise<CryptoKey> {
  const raw = base64ToBuffer(base64Key);
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
}

/**
 * Encrypt an arbitrary JSON‑serializable object.
 * Returns { iv: string, ciphertext: string } where both are base64 strings.
 */
export async function encryptData<T>(data: T, base64Key: string): Promise<{ iv: string; ciphertext: string }> {
  const key = await importKey(base64Key);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96‑bit nonce is recommended for AES‑GCM
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return {
    iv: bufferToBase64(iv.buffer),
    ciphertext: bufferToBase64(encrypted)
  };
}

/**
 * Decrypt data that was encrypted with `encryptData`.
 */
export async function decryptData<T>(payload: { iv: string; ciphertext: string }, base64Key: string): Promise<T> {
  const key = await importKey(base64Key);
  const iv = new Uint8Array(base64ToBuffer(payload.iv));
  const cipher = base64ToBuffer(payload.ciphertext);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  const decoded = new TextDecoder().decode(decrypted);
  return JSON.parse(decoded) as T;
}

/** Helper: Convert ArrayBuffer/TypedArray to Base64 */
function bufferToBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/** Helper: Convert Base64 to Uint8Array */
function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Persist the encryption key in localStorage encrypted with a passphrase.
 * The passphrase is never sent to the server – it stays in memory while the session lasts.
 */
export async function storeKey(passphrase: string, keyBase64: string): Promise<void> {
  // Derive a key from the passphrase using PBKDF2
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const baseKey = await crypto.subtle.importKey('raw', encoder.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveKey']);
  const derived = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, derived, encoder.encode(keyBase64));
  const storageObj = {
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv.buffer),
    data: bufferToBase64(encrypted)
  };
  localStorage.setItem('ehp_enc_key', JSON.stringify(storageObj));
}

/** Retrieve and decrypt the stored key using the user passphrase. */
export async function retrieveKey(passphrase: string): Promise<string | null> {
  const item = localStorage.getItem('ehp_enc_key');
  if (!item) return null;
  const { salt, iv, data } = JSON.parse(item);
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', encoder.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveKey']);
  const derived = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: base64ToBuffer(salt), iterations: 200000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(base64ToBuffer(iv)) }, derived, base64ToBuffer(data));
  return new TextDecoder().decode(decrypted);
}

/**
 * Simple wrapper to encrypt a medical record before sending to the backend.
 * The backend receives only the ciphertext and iv – it cannot read the content.
 */
export async function encryptMedicalRecord(record: any, userPassphrase: string): Promise<{ iv: string; ciphertext: string }> {
  // Retrieve or generate a persistent key for this user
  let storedKey = await retrieveKey(userPassphrase);
  if (!storedKey) {
    storedKey = await generateKey();
    await storeKey(userPassphrase, storedKey);
  }
  return encryptData(record, storedKey);
}

/**
 * Decrypt a medical record fetched from the server.
 */
export async function decryptMedicalRecord(payload: { iv: string; ciphertext: string }, userPassphrase: string): Promise<any> {
  const storedKey = await retrieveKey(userPassphrase);
  if (!storedKey) throw new Error('Encryption key not found.');
  return decryptData(payload, storedKey);
}
