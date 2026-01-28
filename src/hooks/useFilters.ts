import { useState, useMemo, useCallback, useEffect } from 'react';
import { normalizeText } from '@/data/parse';
import type { FilterState, CandidateAssetRow, Municipio, Cargo } from '@/types/tse';
import { getUfsByRegiao, REGIOES, ANOS_DISPONIVEIS } from '@/data/constants';

interface UseFiltersResult {
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  filteredData: CandidateAssetRow[];
  availableRegions: string[];
  availableUfs: { sigla: string; nome: string }[];
  availableMunicipios: Municipio[];
  availableCargos: Cargo[];
  availableYears: number[];
}

const initialFilters: FilterState = {
  ano: ANOS_DISPONIVEIS[0],
  regiao: null,
  uf: null,
  municipio: null,
  cargo: null,
  busca: '',
  ordenacao: 'maior',
};

export function useFilters(
  data: CandidateAssetRow[] | null,
  municipios: Municipio[],
  cargos: Cargo[]
): UseFiltersResult {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  
  // Set filter value
  const setFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      
      // Reset dependent filters
      if (key === 'regiao') {
        next.uf = null;
        next.municipio = null;
        next.cargo = null;
      } else if (key === 'uf') {
        next.municipio = null;
        next.cargo = null;
      } else if (key === 'ano') {
        next.uf = null;
        next.municipio = null;
        next.cargo = null;
        next.regiao = null;
      }
      
      return next;
    });
  }, []);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);
  
  // Available regions
  const availableRegions = useMemo(() => REGIOES.map(r => r.nome), []);
  
  // Available UFs (filtered by region if selected)
  const availableUfs = useMemo(() => {
    if (filters.regiao) {
      return getUfsByRegiao(filters.regiao);
    }
    return getUfsByRegiao('');
  }, [filters.regiao]);
  
  // Available municipalities (from loaded data)
  const availableMunicipios = useMemo(() => municipios, [municipios]);
  
  // Available positions (from loaded data)
  const availableCargos = useMemo(() => cargos, [cargos]);
  
  // Filter and sort data
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    let result = [...data];
    
    // Filter by municipality
    if (filters.municipio) {
      result = result.filter(row => row.ue === filters.municipio);
    }
    
    // Filter by cargo
    if (filters.cargo) {
      result = result.filter(row => row.cd_cargo === filters.cargo);
    }
    
    // Filter by text search (debounced in component)
    if (filters.busca.trim()) {
      const searchNormalized = normalizeText(filters.busca);
      result = result.filter(row => {
        const searchableFields = [
          row.nm_urna_candidato,
          row.sg_partido,
          row.nm_partido,
          row.nr_candidato,
        ].join(' ');
        return normalizeText(searchableFields).includes(searchNormalized);
      });
    }
    
    // Sort
    switch (filters.ordenacao) {
      case 'maior':
        result.sort((a, b) => b.total_bens - a.total_bens);
        break;
      case 'menor':
        result.sort((a, b) => a.total_bens - b.total_bens);
        break;
      case 'az':
        result.sort((a, b) => 
          a.nm_urna_candidato.localeCompare(b.nm_urna_candidato, 'pt-BR')
        );
        break;
    }
    
    return result;
  }, [data, filters.municipio, filters.cargo, filters.busca, filters.ordenacao]);
  
  return {
    filters,
    setFilter,
    resetFilters,
    filteredData,
    availableRegions,
    availableUfs,
    availableMunicipios,
    availableCargos,
    availableYears: ANOS_DISPONIVEIS,
  };
}
