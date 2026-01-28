import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';
import { User, ChevronRight, Package, Building } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency, formatNumber } from '@/lib/format';
import { getCandidatePhotoUrl, getStatusBadge } from '@/lib/tse';
import type { CandidateAssetRow } from '@/types/tse';

interface CandidateTableProps {
  data: CandidateAssetRow[];
  onSelectCandidate: (candidate: CandidateAssetRow) => void;
}

export function CandidateTable({ data, onSelectCandidate }: CandidateTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 68,
    overscan: 10,
  });

  const items = virtualizer.getVirtualItems();

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-muted-foreground"
      >
        <User className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">Nenhum candidato encontrado</p>
        <p className="text-sm">Ajuste os filtros ou carregue dados de outro estado.</p>
      </motion.div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Header */}
      <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-3 bg-table-header border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        <div className="col-span-4">Candidato</div>
        <div className="col-span-2">Partido</div>
        <div className="col-span-2">Município</div>
        <div className="col-span-2">Cargo</div>
        <div className="col-span-2 text-right">Total de Bens</div>
      </div>

      {/* Mobile header */}
      <div className="grid sm:hidden grid-cols-2 gap-2 px-4 py-3 bg-table-header border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        <div>Candidato</div>
        <div className="text-right">Total</div>
      </div>

      {/* Virtualized list */}
      <div ref={parentRef} className="h-[500px] sm:h-[560px] overflow-auto custom-scrollbar">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {items.map((virtualRow) => {
            const candidate = data[virtualRow.index];
            const hasAssets = candidate.total_bens > 0;
            const photoUrl = getCandidatePhotoUrl(candidate);
            const statusBadge = getStatusBadge(candidate.ds_sit_tot_turno);

            return (
              <motion.div
                key={`${candidate.sq_candidato}-${virtualRow.index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <button
                  onClick={() => onSelectCandidate(candidate)}
                  className="w-full h-full grid grid-cols-2 sm:grid-cols-12 gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 items-center sm:items-center text-left hover:bg-table-hover transition-colors border-b border-border/50 group"
                >
                  {/* Candidate info */}
                  <div className="col-span-1 sm:col-span-4 flex items-center gap-3 min-w-0">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                      {photoUrl ? (
                        <AvatarImage
                          src={photoUrl}
                          alt={`Foto de ${candidate.nm_urna_candidato}`}
                          className="object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      <AvatarFallback>
                        <User className="w-5 h-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate leading-tight text-sm sm:text-base">
                        {candidate.nm_urna_candidato}
                      </p>
                      {/* Mobile: only party */}
                      <div className="sm:hidden mt-0 leading-tight">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium">
                          {candidate.sg_partido}
                        </span>
                      </div>
                      {/* Desktop details */}
                      <div className="hidden sm:flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>Nº {candidate.nr_candidato}</span>
                        {statusBadge ? (
                          <span className={statusBadge.className}>{statusBadge.label}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Party */}
                  <div className="hidden sm:flex sm:col-span-2 min-w-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                      {candidate.sg_partido}
                    </span>
                  </div>

                  {/* Municipality */}
                  <div className="hidden sm:flex sm:col-span-2 min-w-0">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Building className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{candidate.nm_ue || candidate.uf}</span>
                    </div>
                  </div>

                  {/* Position */}
                  <div className="hidden sm:flex sm:col-span-2 min-w-0">
                    <span className="text-sm text-muted-foreground truncate block">
                      {candidate.ds_cargo}
                    </span>
                  </div>

                  {/* Total assets */}
                  <div className="col-span-1 sm:col-span-2 flex items-center justify-end gap-2 w-full">
                    <div className="text-right w-full">
                      {hasAssets ? (
                        <>
                          <p className="font-mono font-semibold text-value-positive text-sm sm:text-base leading-tight">
                            {formatCurrency(candidate.total_bens)}
                          </p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center justify-end gap-1 leading-tight">
                            <Package className="w-3 h-3" />
                            {formatNumber(candidate.qtd_bens)} {candidate.qtd_bens === 1 ? 'bem' : 'bens'}
                          </p>
                        </>
                      ) : (
                        <span className="text-[11px] sm:text-sm italic text-value-zero">Sem bens declarados</span>
                      )}
                    </div>
                    <ChevronRight className="hidden sm:block w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer with count */}
      <div className="px-4 py-2 bg-muted/50 border-t border-border text-xs text-muted-foreground text-center sm:text-left">
        Exibindo {formatNumber(data.length)} candidato{data.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
