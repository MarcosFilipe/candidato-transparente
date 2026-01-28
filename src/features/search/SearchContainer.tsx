import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FilterPanel } from './FilterPanel';
import { CandidateTable } from './CandidateTable';
import { CandidateModal } from './CandidateModal';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useDataProcessor } from '@/hooks/useDataProcessor';
import { useFilters } from '@/hooks/useFilters';
import { useDebounce } from '@/hooks/useDebounce';
import type { CandidateAssetRow, FilterState } from '@/types/tse';

export function SearchContainer() {
  const { data, status, loadData, cancel } = useDataProcessor();
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateAssetRow | null>(null);
  
  const {
    filters,
    setFilter,
    resetFilters,
    filteredData,
    availableRegions,
    availableUfs,
    availableMunicipios,
    availableCargos,
    availableYears,
  } = useFilters(
    data?.rows || null,
    data?.municipios || [],
    data?.cargos || []
  );
  
  // Debounce text search
  const debouncedBusca = useDebounce(filters.busca, 300);
  
  // Update filter with debounced value
  useEffect(() => {
    if (debouncedBusca !== filters.busca) {
      // The debounced value will trigger re-filtering via the useFilters hook
    }
  }, [debouncedBusca]);
  
  const handleSearch = useCallback(() => {
    if (filters.ano && filters.uf) {
      loadData(filters.ano, filters.uf);
    }
  }, [filters.ano, filters.uf, loadData]);
  
  const isLoading = status.type === 'downloading' || 
                    status.type === 'parsing' || 
                    status.type === 'processing';
  
  const hasData = data !== null && data.rows.length > 0;
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <FilterPanel
        filters={filters}
        setFilter={setFilter}
        resetFilters={resetFilters}
        onSearch={handleSearch}
        availableYears={availableYears}
        availableRegions={availableRegions}
        availableUfs={availableUfs}
        availableMunicipios={availableMunicipios}
        availableCargos={availableCargos}
        isLoading={isLoading}
        hasData={hasData}
      />
      
      {/* Loading indicator */}
      {(status.type !== 'idle' && status.type !== 'ready') && (
        <LoadingIndicator status={status} />
      )}
      
      {/* Results */}
      {hasData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CandidateTable
            data={filteredData}
            onSelectCandidate={setSelectedCandidate}
          />
        </motion.div>
      )}
      
      {/* Empty state when no UF selected */}
      {!hasData && status.type === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-muted-foreground"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🗳️</span>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Selecione um ano e estado
          </h3>
          <p className="text-sm max-w-md mx-auto">
            Escolha o ano da eleição e o estado (UF) para carregar os dados de patrimônio dos candidatos.
          </p>
        </motion.div>
      )}
      
      {/* Candidate detail modal */}
      <CandidateModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
}
