import type { CandidateAssetRow } from '@/types/tse';
import { normalizeText } from '@/data/parse';

const PHOTO_ELECTION_ID_BY_YEAR: Record<number, string> = {
  2024: '2045202024',
};

export function getCandidatePhotoUrl(candidate: CandidateAssetRow): string | null {
  const electionId = PHOTO_ELECTION_ID_BY_YEAR[candidate.ano];
  if (!electionId || !candidate.sq_candidato || !candidate.ue) return null;

  return `https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/${electionId}/${candidate.sq_candidato}/${candidate.ue}`;
}

export function getStatusBadge(status: string): { label: string; className: string } | null {
  const cleaned = status.trim();
  if (!cleaned) return null;

  const normalized = normalizeText(cleaned);
  if (normalized.includes('suplente')) {
    return { label: cleaned, className: 'status-badge status-badge-loading' };
  }
  if (normalized.includes('nao eleito') || normalized.includes('indeferido')) {
    return { label: cleaned, className: 'status-badge status-badge-error' };
  }
  if (normalized.includes('eleito')) {
    return { label: cleaned, className: 'status-badge status-badge-success' };
  }
  return { label: cleaned, className: 'status-badge' };
}
