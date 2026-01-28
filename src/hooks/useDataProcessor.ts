import { useState, useCallback, useRef, useEffect } from 'react';
import { downloadCsv } from '@/data/download';
import { processData } from '@/data/parse';
import type { CandidateAssetRow, LoadingStatus, Municipio, Cargo } from '@/types/tse';

interface ProcessedData {
  rows: CandidateAssetRow[];
  municipios: Municipio[];
  cargos: Cargo[];
}

interface UseDataProcessorResult {
  data: ProcessedData | null;
  status: LoadingStatus;
  loadData: (ano: number, uf: string) => Promise<void>;
  cancel: () => void;
}

export function useDataProcessor(): UseDataProcessorResult {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [status, setStatus] = useState<LoadingStatus>({ type: 'idle' });
  const abortRef = useRef<AbortController | null>(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);
  
  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus({ type: 'idle' });
  }, []);
  
  const loadData = useCallback(async (ano: number, uf: string) => {
    cancel();
    abortRef.current = new AbortController();
    
    try {
      setStatus({ type: 'downloading', file: `consulta_cand_${ano}_${uf}.csv` });
      const candidatesCsv = await downloadCsv(ano, uf, 'consulta');

      if (abortRef.current?.signal.aborted) return;
      
      setStatus({ type: 'downloading', file: `bem_candidato_${ano}_${uf}.csv` });
      const assetsCsv = await downloadCsv(ano, uf, 'bens');
      
      if (abortRef.current?.signal.aborted) return;
      
      setStatus({ type: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const result = processData(candidatesCsv, assetsCsv, ano, uf);
      setData(result);
      setStatus({ type: 'ready' });
      
    } catch (error) {
      if (abortRef.current?.signal.aborted) {
        setStatus({ type: 'idle' });
      } else {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        setStatus({ type: 'error', message });
      }
    }
  }, [cancel]);
  
  return { data, status, loadData, cancel };
}
