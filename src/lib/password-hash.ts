// Hashing de contrasena via WebCrypto (PBKDF2-SHA256 + sal por usuario).
// El auth de VulnForce sigue siendo local/demostrativo (ver CLAUDE.md), pero
// el hash anterior (djb2 de 32 bits, sin sal) es reversible por fuerza bruta
// en segundos y el hash viajaba tal cual en el JSON de estado/backup.
//
// Formato nuevo: "pbkdf2$<iteraciones>$<saltHex>$<hashHex>".
// Los hashes con el formato viejo (un numero decimal, p.ej. "-123456") se
// siguen verificando con el algoritmo antiguo y se migran en el momento del
// siguiente login o cambio de contrasena correcto.

const PBKDF2_ITERATIONS = 150_000;
const SALT_BYTES = 16;
const HASH_BITS = 256;
const FORMAT_PREFIX = 'pbkdf2';

function toHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

async function deriveBits(password: string, salt: Uint8Array, iterations: number): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    HASH_BITS
  );
}

/** Genera un hash en el formato nuevo para una contrasena en texto plano. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const bits = await deriveBits(password, salt, PBKDF2_ITERATIONS);
  return `${FORMAT_PREFIX}$${PBKDF2_ITERATIONS}$${toHex(salt)}$${toHex(bits)}`;
}

/** Hash con el algoritmo legacy (djb2 de 32 bits), solo para verificar hashes existentes. */
function legacyHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString();
}

export function isLegacyHash(stored: string): boolean {
  return !stored.startsWith(`${FORMAT_PREFIX}$`);
}

/** Verifica una contrasena contra un hash almacenado, en cualquiera de los dos formatos. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (isLegacyHash(stored)) {
    return legacyHash(password) === stored;
  }
  const [, iterationsStr, saltHex, hashHex] = stored.split('$');
  const iterations = Number(iterationsStr);
  if (!iterations || !saltHex || !hashHex) return false;
  const bits = await deriveBits(password, fromHex(saltHex), iterations);
  return toHex(bits) === hashHex;
}
