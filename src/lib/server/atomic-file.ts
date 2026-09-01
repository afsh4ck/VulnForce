import { readFile, writeFile, rename, copyFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';

// Escritura atomica con copia de seguridad rotada, usada por las rutas que
// persisten el estado del servidor (`/api/state`, `/api/variables`).
//
// Sin esto, un corte a mitad de `writeFile` (proceso matado, disco lleno,
// contenedor reiniciado) deja el JSON truncado y sin forma de recuperarlo: el
// archivo se trunca antes de escribir el contenido nuevo. Aqui se escribe a
// un archivo temporal y se renombra sobre el destino (rename es atomico en
// el mismo volumen, tanto en Linux como en Windows), y se conserva la
// version anterior en `<archivo>.bak` por si el contenido nuevo resulta
// invalido.

export async function atomicWriteJson(filePath: string, content: string): Promise<void> {
  // Copia la version anterior antes de sobreescribir. Best-effort: si el
  // archivo aun no existe (primer guardado), no hay nada que rotar.
  try {
    await copyFile(filePath, `${filePath}.bak`);
  } catch (err: any) {
    if (!err || err.code !== 'ENOENT') {
      // No bloquea el guardado por un fallo al rotar el backup.
    }
  }

  const tmpPath = `${filePath}.tmp-${process.pid}-${randomBytes(4).toString('hex')}`;
  await writeFile(tmpPath, content, 'utf8');
  await rename(tmpPath, filePath);
}

/**
 * Lee `filePath` y valida que sea JSON. Si esta corrupto (escritura
 * interrumpida en una version anterior a este cambio) o falta, intenta la
 * copia `.bak`. Devuelve `null` si ninguna de las dos existe.
 */
export async function readJsonWithFallback(filePath: string): Promise<{ raw: string; recoveredFromBackup: boolean } | null> {
  try {
    const raw = await readFile(filePath, 'utf8');
    JSON.parse(raw);
    return { raw, recoveredFromBackup: false };
  } catch (err: any) {
    if (err instanceof SyntaxError) {
      try {
        const backupRaw = await readFile(`${filePath}.bak`, 'utf8');
        JSON.parse(backupRaw);
        console.error(`Estado principal corrupto en ${filePath}; recuperado desde .bak`);
        return { raw: backupRaw, recoveredFromBackup: true };
      } catch {
        throw err;
      }
    }
    if (err && err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}
