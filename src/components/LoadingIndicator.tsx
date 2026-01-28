import { motion } from 'framer-motion';
import { Loader2, Download, Cog, CheckCircle2, XCircle } from 'lucide-react';
import type { LoadingStatus } from '@/types/tse';

interface LoadingIndicatorProps {
  status: LoadingStatus;
}

export function LoadingIndicator({ status }: LoadingIndicatorProps) {
  if (status.type === 'idle' || status.type === 'ready') {
    return null;
  }
  
  const getIcon = () => {
    switch (status.type) {
      case 'downloading':
        return <Download className="w-5 h-5 animate-pulse" />;
      case 'parsing':
      case 'processing':
        return <Cog className="w-5 h-5 animate-spin-slow" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Loader2 className="w-5 h-5 animate-spin" />;
    }
  };
  
  const getMessage = () => {
    switch (status.type) {
      case 'downloading':
        return status.file || 'Baixando arquivo...';
      case 'parsing':
        return `Analisando ${status.file || 'dados'}...`;
      case 'processing':
        return 'Processando dados...';
      case 'error':
        return status.message || 'Erro ao carregar dados';
      default:
        return 'Carregando...';
    }
  };
  
  const isError = status.type === 'error';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
        isError 
          ? 'bg-destructive/10 text-destructive border border-destructive/20' 
          : 'bg-primary/10 text-primary border border-primary/20'
      }`}
    >
      {getIcon()}
      <span className="text-sm font-medium">{getMessage()}</span>
    </motion.div>
  );
}
