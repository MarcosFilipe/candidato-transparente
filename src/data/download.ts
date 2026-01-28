import { getCached, setCache, getCacheKey, getMemoryCached, setMemoryCache, clearMemoryCache, clearCache } from './cache';

/**
 * Download and decode a CSV file with Latin-1 encoding
 */
export async function downloadCsv(
  ano: number,
  uf: string,
  tipo: 'consulta' | 'bens',
  onProgress?: (status: string) => void
): Promise<string> {
  const ufNormalized = uf.toUpperCase();
  const cacheKey = getCacheKey(ano, ufNormalized, tipo);

  clearCache();
  clearMemoryCache();

  console.log({cacheKey});

  // Check memory cache first
  const memoryCached = getMemoryCached(cacheKey);
  if (memoryCached) {
    onProgress?.('Usando cache em memória...');
    return memoryCached;
  }

  // Check IndexedDB cache
  const cached = await getCached(cacheKey);
  if (cached) {
    onProgress?.('Usando cache local...');
    setMemoryCache(cacheKey, cached);
    return cached;
  }

  // Build file paths (support both legacy uppercase and lowercase filenames)
  const folder = tipo === 'consulta' ? 'consulta' : 'bens';
  const prefix = tipo === 'consulta' ? 'consulta_cand' : 'bem_candidato';
  const fileNames = [
    `${prefix}_${ano}_${ufNormalized}.csv`,
    `${prefix.toLowerCase()}_${ano}_${ufNormalized}.csv`,
  ];
  const paths = fileNames.map((fileName) => `/data/${ano}/${folder}/${fileName}`);

  onProgress?.(`Baixando ${fileNames[0]}...`);

  try {
    let response: Response | null = null;

    for (const path of paths) {
      const attempt = await fetch(path);
      if (attempt.ok) {
        response = attempt;
        break;
      }
    }

    if (!response) {
      throw new Error(`Arquivo não encontrado: ${paths.join(' | ')}`);
    }

    // Download as ArrayBuffer to handle Latin-1 encoding
    const buffer = await response.arrayBuffer();

    onProgress?.('Decodificando arquivo...');

    // Decode as Latin-1 (ISO-8859-1)
    let text: string;
    try {
      const decoder = new TextDecoder('iso-8859-1');
      text = decoder.decode(buffer);
    } catch {
      // Fallback to UTF-8 if Latin-1 fails
      const decoder = new TextDecoder('utf-8');
      text = decoder.decode(buffer);
    }

    // Cache the result
    setMemoryCache(cacheKey, text);
    await setCache(cacheKey, text);

    return text;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Falha ao baixar ${tipo} para ${ufNormalized}/${ano}: ${message}`);
  }
}

/**
 * Check if files exist for a given year/UF
 */
export async function checkFilesExist(ano: number, uf: string): Promise<boolean> {
  try {
    const ufNormalized = uf.toUpperCase();
    const consultaPaths = [
      `/data/${ano}/consulta/CONSULTA_CAND_${ano}_${ufNormalized}.csv`,
      `/data/${ano}/consulta/consulta_cand_${ano}_${ufNormalized}.csv`,
    ];
    const bensPaths = [
      `/data/${ano}/bens/BEM_CANDIDATO_${ano}_${ufNormalized}.csv`,
      `/data/${ano}/bens/bem_candidato_${ano}_${ufNormalized}.csv`,
    ];

    const [consultaRes, bensRes] = await Promise.all([
      Promise.any(consultaPaths.map((path) => fetch(path, { method: 'HEAD' }))),
      Promise.any(bensPaths.map((path) => fetch(path, { method: 'HEAD' }))),
    ]);

    return consultaRes.ok && bensRes.ok;
  } catch {
    return false;
  }
}
