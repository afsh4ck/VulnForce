import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

// Bloquea SSRF hacia infraestructura interna (metadata cloud, servicios en
// localhost, red privada) para cualquier fetch que el servidor haga a una URL
// proporcionada por el usuario (p.ej. `/api/link-preview`).

function ipv4ToInt(ip: string): number {
  return ip.split('.').reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
}

function inIpv4Range(ip: string, base: string, bits: number): boolean {
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(base) & mask);
}

const PRIVATE_IPV4_RANGES: [string, number][] = [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10], // CGNAT
  ['127.0.0.0', 8],
  ['169.254.0.0', 16], // link-local, incluye el endpoint de metadata cloud (169.254.169.254)
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['224.0.0.0', 4], // multicast
];

function isPrivateIpv4(ip: string): boolean {
  return PRIVATE_IPV4_RANGES.some(([base, bits]) => inIpv4Range(ip, base, bits));
}

function isPrivateIpv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === '::') return true;
  // IPv4 mapeada (::ffff:a.b.c.d): valida la IPv4 embebida.
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(lower);
  if (mapped) return isPrivateIpv4(mapped[1]);
  if (lower.startsWith('fe80:')) return true; // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // ULA fc00::/7
  return false;
}

export function isPrivateIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateIpv4(ip);
  if (version === 6) return isPrivateIpv6(ip);
  return true; // no es una IP reconocible: se rechaza por seguridad
}

export class SsrfBlockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SsrfBlockedError';
  }
}

/** Lanza si la URL no es http(s) publica, o si resuelve a una IP privada/reservada. */
export async function assertPublicHttpUrl(urlString: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    throw new SsrfBlockedError('URL invalida');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new SsrfBlockedError('Solo se permiten URLs http/https');
  }

  let addresses: { address: string }[];
  try {
    addresses = await lookup(url.hostname, { all: true, verbatim: true });
  } catch {
    throw new SsrfBlockedError('No se pudo resolver el host');
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
    throw new SsrfBlockedError('El host resuelve a una direccion interna no permitida');
  }

  return url;
}
