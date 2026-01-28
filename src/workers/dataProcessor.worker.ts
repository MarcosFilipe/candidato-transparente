import { processData } from '@/data/parse';
import type { WorkerRequest, WorkerResponse } from '@/types/tse';

/**
 * Web Worker for processing TSE data
 * Runs parsing and aggregation off the main thread
 */

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { type, candidatesCsv, assetsCsv, ano, uf } = event.data;
  
  if (type !== 'process') {
    return;
  }
  
  try {
    // Send progress update
    const progressResponse: WorkerResponse = {
      type: 'progress',
      message: 'Processando dados...',
      progress: 50,
    };
    self.postMessage(progressResponse);
    
    // Process data
    const result = processData(candidatesCsv, assetsCsv, ano, uf);
    
    // Send success response
    const successResponse: WorkerResponse = {
      type: 'success',
      data: result.rows,
      municipios: result.municipios,
      cargos: result.cargos,
    };
    self.postMessage(successResponse);
    
  } catch (error) {
    const errorResponse: WorkerResponse = {
      type: 'error',
      message: error instanceof Error ? error.message : 'Erro ao processar dados',
    };
    self.postMessage(errorResponse);
  }
};
