import { getCached, setCache, getCacheKey, getMemoryCached, setMemoryCache } from './cache';

/**
 * Download and decode a CSV file with Latin-1 encoding
 */
export async function downloadCsv(
  ano: number,
  uf: string,
  tipo: 'consulta' | 'bens',
  onProgress?: (status: string) => void
): Promise<string> {
  const cacheKey = getCacheKey(ano, uf, tipo);
  
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
  
  // Build file path
  const folder = tipo === 'consulta' ? 'consulta' : 'bens';
  const prefix = tipo === 'consulta' ? 'CONSULTA_CAND' : 'BEM_CANDIDATO';
  const path = `/data/${ano}/${folder}/${prefix}_${ano}_${uf}.csv`;
  
  onProgress?.(`Baixando ${prefix}_${ano}_${uf}.csv...`);
  
  try {
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`Arquivo não encontrado: ${path}`);
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
    throw new Error(`Falha ao baixar ${tipo} para ${uf}/${ano}: ${message}`);
  }
}

/**
 * Check if files exist for a given year/UF
 */
export async function checkFilesExist(ano: number, uf: string): Promise<boolean> {
  try {
    const consultaPath = `/data/${ano}/consulta/CONSULTA_CAND_${ano}_${uf}.csv`;
    const bensPath = `/data/${ano}/bens/BEM_CANDIDATO_${ano}_${uf}.csv`;
    
    const [consultaRes, bensRes] = await Promise.all([
      fetch(consultaPath, { method: 'HEAD' }),
      fetch(bensPath, { method: 'HEAD' }),
    ]);
    
    return consultaRes.ok && bensRes.ok;
  } catch {
    return false;
  }
}
