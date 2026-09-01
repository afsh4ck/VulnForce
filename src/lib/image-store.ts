'use client';

import type { ImageAsset } from './types';

// Las imagenes (logos, capturas de hallazgos) se guardaban en localStorage
// junto al resto del estado, compartiendo su cuota de ~5MB. Al llenarse,
// `setItem` lanzaba y el guardado se perdia en silencio. IndexedDB no tiene
// ese limite practico, asi que las imagenes viven aqui; el resto de
// colecciones sigue en localStorage (ver `usePersistedState` en data-context).

const DB_NAME = 'vulnforce-db';
const DB_VERSION = 1;
const STORE_NAME = 'images';

/** Clave de localStorage usada antes de esta migracion (solo lectura, para migrar). */
export const LEGACY_IMAGES_LOCALSTORAGE_KEY = 'vulnforce-images-v4';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB no disponible'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadAllImages(): Promise<ImageAsset[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as ImageAsset[]);
    req.onerror = () => reject(req.error);
  });
}

/** Reemplaza todo el contenido del store por `images` (misma semantica que el mirror completo que antes hacia localStorage). */
export async function saveAllImages(images: ImageAsset[]): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    images.forEach((img) => store.put(img));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearAllImages(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Lee la clave de localStorage antigua, para el migrador one-shot. No la borra. */
export function readLegacyLocalStorageImages(): ImageAsset[] | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_IMAGES_LOCALSTORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearLegacyLocalStorageImages(): void {
  try {
    window.localStorage.removeItem(LEGACY_IMAGES_LOCALSTORAGE_KEY);
  } catch {
    // ignore
  }
}
