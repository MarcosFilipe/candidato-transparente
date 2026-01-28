import { motion } from 'framer-motion';
import { Building2, FileText, Database } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="app-header py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                TSE Bens
              </h1>
              <p className="text-sm text-white/70">
                Consulta de Patrimônio de Candidatos
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 ml-auto text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>{new Date().toLocaleString()} </span>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
