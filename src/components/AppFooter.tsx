import { motion } from 'framer-motion';
import { ExternalLink, AlertCircle } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-sm text-muted-foreground"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p>
                <strong>Fonte:</strong> TSE (Dados Abertos) — Repositório de Dados Eleitorais.
              </p>
              <p className="text-xs">
                Arquivos CSV em Latin-1 (ISO-8859-1), separador ";". 
                Valores especiais: #NULO/-1 (vazio), #NE/-3 (não registrado).
              </p>
            </div>
          </div>
          
          <a
            href="https://dadosabertos.tse.jus.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <span>Portal de Dados Abertos TSE</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
