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
          <div className="flex items-start gap-2 w-full md:w-auto justify-center md:justify-start text-center md:text-left">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p>
                <strong>Fonte:</strong> TSE (Dados Abertos) — Repositório de Dados Eleitorais.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-primary md:justify-end w-full md:w-auto justify-center">
            <span>
              Desenvolvido por{' '}
              <a
                href="https://github.com/marcosfilipe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Marcos Filipe
              </a>
            </span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
