import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Coins, Building, Briefcase, FileText, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatNumber } from '@/lib/format';
import type { CandidateAssetRow } from '@/types/tse';

interface CandidateModalProps {
  candidate: CandidateAssetRow | null;
  onClose: () => void;
}

export function CandidateModal({ candidate, onClose }: CandidateModalProps) {
  if (!candidate) return null;
  
  const validBens = candidate.bens.filter(b => b.valor !== null && b.valor > 0);
  const sortedBens = [...validBens].sort((a, b) => (b.valor || 0) - (a.valor || 0));
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card border border-border rounded-xl shadow-lg max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="app-header px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {candidate.nm_urna_candidato}
                  </h2>
                  <div className="flex items-center gap-3 text-white/70 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {candidate.ds_cargo}
                    </span>
                    <span>•</span>
                    <span>{candidate.sg_partido}</span>
                    <span>•</span>
                    <span>Nº {candidate.nr_candidato}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-muted/50 border-b border-border">
            <div className="text-center">
              <Coins className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold font-mono text-value-positive">
                {formatCurrency(candidate.total_bens)}
              </p>
              <p className="text-xs text-muted-foreground">Total Declarado</p>
            </div>
            <div className="text-center">
              <Package className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">
                {formatNumber(candidate.qtd_bens)}
              </p>
              <p className="text-xs text-muted-foreground">Bens Declarados</p>
            </div>
            <div className="text-center">
              <Building className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-lg font-semibold truncate px-2">
                {candidate.nm_ue || candidate.uf}
              </p>
              <p className="text-xs text-muted-foreground">Município/UF</p>
            </div>
          </div>
          
          {/* Assets list */}
          <div className="flex-1 overflow-auto p-6 custom-scrollbar">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              <FileText className="w-4 h-4" />
              Detalhamento dos Bens
            </h3>
            
            {sortedBens.length > 0 ? (
              <div className="space-y-3">
                {sortedBens.map((bem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                        {bem.tipo || 'Bem não especificado'}
                      </p>
                      <p className="text-sm text-foreground mb-2 break-words">
                        {bem.descricao || 'Sem descrição'}
                      </p>
                      <p className="font-mono font-semibold text-value-positive">
                        {bem.valor ? formatCurrency(bem.valor) : 'Valor não informado'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum bem declarado</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-muted/50 border-t border-border flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Eleição: {candidate.ano} • {candidate.nm_partido}
            </div>
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
