const fs = require('fs');
const Papa = require('papaparse');

function isTseNull(value) {
  const trimmed = value.trim();
  return trimmed === '#NULO' || trimmed === '#NULO#' || trimmed === '-1';
}

function isTseNotRegistered(value) {
  const trimmed = value.trim();
  return trimmed === '#NE' || trimmed === '#NE#' || trimmed === '-3';
}

function parseMonetaryValue(value) {
  if (!value) return null;
  const trimmed = value.trim().replace(/^"|"$/g, '');
  if (isTseNull(trimmed) || isTseNotRegistered(trimmed)) return null;
  let normalized = trimmed.replace(/\./g, '').replace(',', '.');
  if (trimmed.includes('.') && !trimmed.includes(',')) {
    const parts = trimmed.split('.');
    if (parts.length === 2 && parts[1].length <= 2) normalized = trimmed;
  }
  const parsed = parseFloat(normalized);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return parsed;
}

function cleanTseString(value) {
  if (!value) return '';
  const trimmed = value.trim().replace(/^"|"$/g, '');
  if (isTseNull(trimmed) || isTseNotRegistered(trimmed)) return '';
  return trimmed;
}

function makeCompositeKey(ano, uf, ue, sq) {
  return `${ano}|${uf}|${ue}|${sq}`;
}

function parseCsv(text) {
  const result = Papa.parse(text, {
    header: true,
    delimiter: ';',
    quoteChar: '"',
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().replace(/^"|"$/g, ''),
  });
  if (result.errors.length) {
    console.warn('errors', result.errors.slice(0, 5));
  }
  return result.data;
}

const candidatesCsv = fs.readFileSync('public/data/2024/consulta/consulta_cand_2024_SC.csv','latin1');
const assetsCsv = fs.readFileSync('public/data/2024/bens/bem_candidato_2024_SC.csv','latin1');

const candidates = parseCsv(candidatesCsv);
const assets = parseCsv(assetsCsv);

const candidateMap = new Map();
const municipioMap = new Map();
const cargoMap = new Map();

for (const candidate of candidates) {
  const key = makeCompositeKey(
    cleanTseString(candidate.ANO_ELEICAO),
    cleanTseString(candidate.SG_UF),
    cleanTseString(candidate.SG_UE),
    cleanTseString(candidate.SQ_CANDIDATO)
  );
  if (key === '|||') continue;
  candidateMap.set(key, candidate);
  const sgUe = cleanTseString(candidate.SG_UE);
  const nmUe = cleanTseString(candidate.NM_UE);
  if (sgUe && nmUe) municipioMap.set(sgUe, nmUe);
  const cdCargo = cleanTseString(candidate.CD_CARGO);
  const dsCargo = cleanTseString(candidate.DS_CARGO);
  if (cdCargo && dsCargo) cargoMap.set(cdCargo, dsCargo);
}

const assetsByCandidate = new Map();
for (const asset of assets) {
  const key = makeCompositeKey(
    cleanTseString(asset.ANO_ELEICAO),
    cleanTseString(asset.SG_UF),
    cleanTseString(asset.SG_UE),
    cleanTseString(asset.SQ_CANDIDATO)
  );
  if (key === '|||') continue;
  const valor = parseMonetaryValue(asset.VR_BEM_CANDIDATO);
  const parsedAsset = {
    tipo: cleanTseString(asset.DS_TIPO_BEM_CANDIDATO),
    descricao: cleanTseString(asset.DS_BEM_CANDIDATO),
    valor,
  };
  if (!assetsByCandidate.has(key)) assetsByCandidate.set(key, []);
  assetsByCandidate.get(key).push(parsedAsset);
}

const rows = [];
for (const [key, candidate] of candidateMap) {
  const bens = assetsByCandidate.get(key) || [];
  const validBens = bens.filter(b => b.valor !== null && b.valor > 0);
  const totalBens = validBens.reduce((sum, b) => sum + (b.valor || 0), 0);
  const qtdBens = validBens.length;
  rows.push({
    ano: 2024,
    uf: cleanTseString(candidate.SG_UF) || 'SC',
    ue: cleanTseString(candidate.SG_UE),
    nm_ue: cleanTseString(candidate.NM_UE),
    sq_candidato: cleanTseString(candidate.SQ_CANDIDATO),
    nm_urna_candidato: cleanTseString(candidate.NM_URNA_CANDIDATO),
    nr_candidato: cleanTseString(candidate.NR_CANDIDATO),
    sg_partido: cleanTseString(candidate.SG_PARTIDO),
    nm_partido: cleanTseString(candidate.NM_PARTIDO),
    cd_cargo: cleanTseString(candidate.CD_CARGO),
    ds_cargo: cleanTseString(candidate.DS_CARGO),
    total_bens: totalBens,
    qtd_bens: qtdBens,
    bens,
  });
}

console.log('rows', rows.length, 'municipios', municipioMap.size, 'cargos', cargoMap.size);
console.log(rows[0]);
