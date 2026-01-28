import type { Region, UF } from '@/types/tse';

/**
 * Brazilian regions with their states
 */
export const REGIOES: Region[] = [
  {
    nome: 'Norte',
    ufs: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
  },
  {
    nome: 'Nordeste',
    ufs: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  },
  {
    nome: 'Centro-Oeste',
    ufs: ['DF', 'GO', 'MT', 'MS'],
  },
  {
    nome: 'Sudeste',
    ufs: ['ES', 'MG', 'RJ', 'SP'],
  },
  {
    nome: 'Sul',
    ufs: ['PR', 'RS', 'SC'],
  },
];

/**
 * All Brazilian states
 */
export const UFS: UF[] = [
  { sigla: 'AC', nome: 'Acre', regiao: 'Norte' },
  { sigla: 'AL', nome: 'Alagoas', regiao: 'Nordeste' },
  { sigla: 'AP', nome: 'Amapá', regiao: 'Norte' },
  { sigla: 'AM', nome: 'Amazonas', regiao: 'Norte' },
  { sigla: 'BA', nome: 'Bahia', regiao: 'Nordeste' },
  { sigla: 'CE', nome: 'Ceará', regiao: 'Nordeste' },
  { sigla: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
  { sigla: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste' },
  { sigla: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste' },
  { sigla: 'MA', nome: 'Maranhão', regiao: 'Nordeste' },
  { sigla: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
  { sigla: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste' },
  { sigla: 'PA', nome: 'Pará', regiao: 'Norte' },
  { sigla: 'PB', nome: 'Paraíba', regiao: 'Nordeste' },
  { sigla: 'PR', nome: 'Paraná', regiao: 'Sul' },
  { sigla: 'PE', nome: 'Pernambuco', regiao: 'Nordeste' },
  { sigla: 'PI', nome: 'Piauí', regiao: 'Nordeste' },
  { sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
  { sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
  { sigla: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },
  { sigla: 'RO', nome: 'Rondônia', regiao: 'Norte' },
  { sigla: 'RR', nome: 'Roraima', regiao: 'Norte' },
  { sigla: 'SC', nome: 'Santa Catarina', regiao: 'Sul' },
  { sigla: 'SP', nome: 'São Paulo', regiao: 'Sudeste' },
  { sigla: 'SE', nome: 'Sergipe', regiao: 'Nordeste' },
  { sigla: 'TO', nome: 'Tocantins', regiao: 'Norte' },
];

/**
 * Available election years
 */
export const ANOS_DISPONIVEIS = [2024, 2022, 2020, 2018, 2016, 2014, 2012];

/**
 * Get UFs by region
 */
export function getUfsByRegiao(regiao: string): UF[] {
  const region = REGIOES.find(r => r.nome === regiao);
  if (!region) return UFS;
  return UFS.filter(uf => region.ufs.includes(uf.sigla));
}

/**
 * Get region by UF
 */
export function getRegiaoByUf(sigla: string): string | undefined {
  return UFS.find(uf => uf.sigla === sigla)?.regiao;
}
