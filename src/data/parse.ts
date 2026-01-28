import Papa from 'papaparse';
import type { RawCandidateData, RawAssetData, CandidateAssetRow, CandidateAsset, Municipio, Cargo } from '@/types/tse';

/**
 * Normalize text: remove accents, lowercase, trim
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Check if value is TSE null (#NULO or -1)
 */
export function isTseNull(value: string): boolean {
  const trimmed = value.trim();
  return trimmed === '#NULO' || trimmed === '#NULO#' || trimmed === '-1';
}

/**
 * Check if value is TSE "not registered" (#NE or -3)
 */
export function isTseNotRegistered(value: string): boolean {
  const trimmed = value.trim();
  return trimmed === '#NE' || trimmed === '#NE#' || trimmed === '-3';
}

/**
 * Parse monetary value from TSE format
 * Handles: "1234.56", "1234,56", "-1", "-3", "#NULO"
 */
export function parseMonetaryValue(value: string): number | null {
  if (value === null || value === undefined) return null;
  
  const trimmed = String(value).trim().replace(/^"|"$/g, '');
  
  // Check for special values
  if (isTseNull(trimmed) || isTseNotRegistered(trimmed)) {
    return null;
  }
  
  // Normalize decimal separator
  let normalized = trimmed
    .replace(/\./g, '') // Remove thousands separator
    .replace(',', '.'); // Convert decimal comma to dot
  
  // Handle case where there's only dot as decimal separator
  if (trimmed.includes('.') && !trimmed.includes(',')) {
    const parts = trimmed.split('.');
    if (parts.length === 2 && parts[1].length <= 2) {
      normalized = trimmed;
    }
  }
  
  const parsed = parseFloat(normalized);
  
  if (isNaN(parsed) || parsed < 0) {
    return null;
  }
  
  return parsed;
}

/**
 * Clean TSE string value
 */
export function cleanTseString(value: string): string {
  if (value === null || value === undefined) return '';
  
  const trimmed = String(value).trim().replace(/^"|"$/g, '');
  
  if (isTseNull(trimmed) || isTseNotRegistered(trimmed)) {
    return '';
  }
  
  return trimmed;
}

/**
 * Generate composite key for joining
 */
export function makeCompositeKey(ano: string | number, uf: string, ue: string, sqCandidato: string): string {
  return `${ano}|${uf}|${ue}|${sqCandidato}`;
}

/**
 * Parse CSV with PapaParse
 */
export function parseCsv<T>(csvText: string): T[] {
  const sanitized = csvText
    .replace(/^\uFEFF/, '')
    .replace(/\u0000/g, '');

  const result = Papa.parse<T>(sanitized, {
    header: true,
    delimiter: ';',
    quoteChar: '"',
    skipEmptyLines: 'greedy',
    transformHeader: (header) =>
      header
        .trim()
        .replace(/^"|"$/g, '')
        .replace(/^\uFEFF/, '')
        .toUpperCase(),
  });
  
  if (result.errors.length > 0) {
    console.warn('CSV parse warnings:', result.errors.slice(0, 5));
  }
  
  return result.data.filter((row) =>
    Object.values(row as Record<string, unknown>).some((value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      return true;
    })
  );
}

/**
 * Process and aggregate TSE data
 */
export function processData(
  candidatesCsv: string,
  assetsCsv: string,
  ano: number,
  uf: string
): {
  rows: CandidateAssetRow[];
  municipios: Municipio[];
  cargos: Cargo[];
} {
  // Parse CSVs
  const candidates = parseCsv<RawCandidateData>(candidatesCsv);
  const assets = parseCsv<RawAssetData>(assetsCsv);
  
  // Build candidate map
  const candidateMap = new Map<string, RawCandidateData>();
  const municipioMap = new Map<string, string>(); // SG_UE -> NM_UE
  const cargoMap = new Map<string, string>(); // CD_CARGO -> DS_CARGO
  
  for (const candidate of candidates) {
    const key = makeCompositeKey(
      cleanTseString(candidate.ANO_ELEICAO),
      cleanTseString(candidate.SG_UF),
      cleanTseString(candidate.SG_UE),
      cleanTseString(candidate.SQ_CANDIDATO)
    );
    candidateMap.set(key, candidate);
    
    // Collect unique municipalities and positions
    const sgUe = cleanTseString(candidate.SG_UE);
    const nmUe = cleanTseString(candidate.NM_UE);
    if (sgUe && nmUe) {
      municipioMap.set(sgUe, nmUe);
    }
    
    const cdCargo = cleanTseString(candidate.CD_CARGO);
    const dsCargo = cleanTseString(candidate.DS_CARGO);
    if (cdCargo && dsCargo) {
      cargoMap.set(cdCargo, dsCargo);
    }
  }
  
  // Aggregate assets by candidate
  const assetsByCandidate = new Map<string, CandidateAsset[]>();
  
  for (const asset of assets) {
    const key = makeCompositeKey(
      cleanTseString(asset.ANO_ELEICAO),
      cleanTseString(asset.SG_UF),
      cleanTseString(asset.SG_UE),
      cleanTseString(asset.SQ_CANDIDATO)
    );
    
    const valor = parseMonetaryValue(asset.VR_BEM_CANDIDATO);
    const parsedAsset: CandidateAsset = {
      tipo: cleanTseString(asset.DS_TIPO_BEM_CANDIDATO),
      descricao: cleanTseString(asset.DS_BEM_CANDIDATO),
      valor,
    };
    
    if (!assetsByCandidate.has(key)) {
      assetsByCandidate.set(key, []);
    }
    assetsByCandidate.get(key)!.push(parsedAsset);
  }
  
  // Build final rows
  const rows: CandidateAssetRow[] = [];
  
  for (const [key, candidate] of candidateMap) {
    const bens = assetsByCandidate.get(key) || [];
    
    // Calculate totals (only count valid values)
    const validBens = bens.filter(b => b.valor !== null && b.valor > 0);
    const totalBens = validBens.reduce((sum, b) => sum + (b.valor || 0), 0);
    const qtdBens = validBens.length;
    
    const row: CandidateAssetRow = {
      ano,
      uf: cleanTseString(candidate.SG_UF) || uf,
      ue: cleanTseString(candidate.SG_UE),
      nm_ue: cleanTseString(candidate.NM_UE),
      sq_candidato: cleanTseString(candidate.SQ_CANDIDATO),
      nm_urna_candidato: cleanTseString(candidate.NM_URNA_CANDIDATO),
      nr_candidato: cleanTseString(candidate.NR_CANDIDATO),
      sg_partido: cleanTseString(candidate.SG_PARTIDO),
      nm_partido: cleanTseString(candidate.NM_PARTIDO),
      cd_cargo: cleanTseString(candidate.CD_CARGO),
      ds_cargo: cleanTseString(candidate.DS_CARGO),
      cd_sit_tot_turno: cleanTseString(candidate.CD_SIT_TOT_TURNO),
      ds_sit_tot_turno: cleanTseString(candidate.DS_SIT_TOT_TURNO),
      total_bens: totalBens,
      qtd_bens: qtdBens,
      bens,
    };
    
    rows.push(row);
  }
  
  // Convert maps to arrays
  const municipios: Municipio[] = Array.from(municipioMap.entries())
    .map(([sg_ue, nm_ue]) => ({ sg_ue, nm_ue }))
    .sort((a, b) => a.nm_ue.localeCompare(b.nm_ue, 'pt-BR'));
  
  const cargos: Cargo[] = Array.from(cargoMap.entries())
    .map(([cd_cargo, ds_cargo]) => ({ cd_cargo, ds_cargo }))
    .sort((a, b) => a.ds_cargo.localeCompare(b.ds_cargo, 'pt-BR'));
  
  return { rows, municipios, cargos };
}
