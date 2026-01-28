// TSE Data Types

/**
 * Raw candidate data from CONSULTA_CAND CSV
 */
export interface RawCandidateData {
  ANO_ELEICAO: string;
  SG_UF: string;
  SG_UE: string;
  NM_UE: string;
  CD_CARGO: string;
  DS_CARGO: string;
  SQ_CANDIDATO: string;
  NM_URNA_CANDIDATO: string;
  NR_CANDIDATO: string;
  SG_PARTIDO: string;
  NM_PARTIDO: string;
}

/**
 * Raw asset data from BEM_CANDIDATO CSV
 */
export interface RawAssetData {
  ANO_ELEICAO: string;
  SG_UF: string;
  SG_UE: string;
  SQ_CANDIDATO: string;
  DS_TIPO_BEM_CANDIDATO: string;
  DS_BEM_CANDIDATO: string;
  VR_BEM_CANDIDATO: string;
}

/**
 * Parsed individual asset
 */
export interface CandidateAsset {
  tipo: string;
  descricao: string;
  valor: number | null;
}

/**
 * Aggregated candidate asset row for display
 */
export interface CandidateAssetRow {
  // Keys
  ano: number;
  uf: string;
  ue: string;
  nm_ue: string;
  sq_candidato: string;
  
  // Candidate info
  nm_urna_candidato: string;
  nr_candidato: string;
  sg_partido: string;
  nm_partido: string;
  
  // Position
  cd_cargo: string;
  ds_cargo: string;
  
  // Aggregated values
  total_bens: number;
  qtd_bens: number;
  
  // Detail data
  bens: CandidateAsset[];
}

/**
 * Filter state
 */
export interface FilterState {
  ano: number | null;
  regiao: string | null;
  uf: string | null;
  municipio: string | null; // SG_UE
  cargo: string | null;
  busca: string;
  ordenacao: 'maior' | 'menor' | 'az';
}

/**
 * Region definition
 */
export interface Region {
  nome: string;
  ufs: string[];
}

/**
 * UF (State) definition
 */
export interface UF {
  sigla: string;
  nome: string;
  regiao: string;
}

/**
 * Municipality from data
 */
export interface Municipio {
  sg_ue: string;
  nm_ue: string;
}

/**
 * Cargo from data
 */
export interface Cargo {
  cd_cargo: string;
  ds_cargo: string;
}

/**
 * Cache metadata
 */
export interface CacheEntry {
  ano: number;
  uf: string;
  tipo: 'consulta' | 'bens';
  timestamp: number;
  data: string; // JSON stringified
}

/**
 * Loading status
 */
export type LoadingStatus = 
  | { type: 'idle' }
  | { type: 'downloading'; file: string; progress?: number }
  | { type: 'parsing'; file: string }
  | { type: 'processing' }
  | { type: 'ready' }
  | { type: 'error'; message: string };

/**
 * Worker message types
 */
export interface WorkerRequest {
  type: 'process';
  candidatesCsv: string;
  assetsCsv: string;
  ano: number;
  uf: string;
}

export interface WorkerResponse {
  type: 'success' | 'error' | 'progress';
  data?: CandidateAssetRow[];
  municipios?: Municipio[];
  cargos?: Cargo[];
  message?: string;
  progress?: number;
}
