import { motion } from 'framer-motion';
import { Search, RotateCcw, Calendar, MapPin, Building, Briefcase, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterState, Municipio, Cargo } from '@/types/tse';

interface FilterPanelProps {
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  onSearch: () => void;
  availableYears: number[];
  availableRegions: string[];
  availableUfs: { sigla: string; nome: string }[];
  availableMunicipios: Municipio[];
  availableCargos: Cargo[];
  isLoading: boolean;
  hasData: boolean;
}

const ALL_VALUE = '__all__';

export function FilterPanel({
  filters,
  setFilter,
  resetFilters,
  onSearch,
  availableYears,
  availableRegions,
  availableUfs,
  availableMunicipios,
  availableCargos,
  isLoading,
  hasData,
}: FilterPanelProps) {
  const canSearch = filters.ano && filters.uf;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="filter-panel space-y-4"
    >
      {/* Primary filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Year */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            Ano da Eleição
          </label>
          <Select
            value={filters.ano?.toString() || ''}
            onValueChange={(v) => setFilter('ano', parseInt(v))}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            Região
          </label>
          <Select
            value={filters.regiao || ALL_VALUE}
            onValueChange={(v) => setFilter('regiao', v === ALL_VALUE ? null : v)}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Todas as regiões" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              <SelectItem value={ALL_VALUE}>Todas as regiões</SelectItem>
              {availableRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* UF */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            Estado (UF)
          </label>
          <Select
            value={filters.uf || ''}
            onValueChange={(v) => setFilter('uf', v || null)}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50 max-h-60">
              {availableUfs.map((uf) => (
                <SelectItem key={uf.sigla} value={uf.sigla}>
                  {uf.sigla} - {uf.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search button */}
        <div className="space-y-1.5 lg:col-span-2 flex items-end gap-2">
          <Button
            onClick={onSearch}
            disabled={!canSearch || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ⏳
                </motion.span>
                Carregando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Buscar Dados
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={resetFilters}
            title="Limpar filtros"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Secondary filters (only show when data is loaded) */}
      {hasData && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-3 border-t border-border"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Municipality */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Building className="w-3.5 h-3.5" />
                Município
              </label>
              <Select
                value={filters.municipio || ALL_VALUE}
                onValueChange={(v) => setFilter('municipio', v === ALL_VALUE ? null : v)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Todos os municípios" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50 max-h-60">
                  <SelectItem value={ALL_VALUE}>Todos os municípios</SelectItem>
                  {availableMunicipios.map((mun) => (
                    <SelectItem key={mun.sg_ue} value={mun.sg_ue}>
                      {mun.nm_ue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cargo */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5" />
                Cargo
              </label>
              <Select
                value={filters.cargo || ALL_VALUE}
                onValueChange={(v) => setFilter('cargo', v === ALL_VALUE ? null : v)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Todos os cargos" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value={ALL_VALUE}>Todos os cargos</SelectItem>
                  {availableCargos.map((cargo) => (
                    <SelectItem key={cargo.cd_cargo} value={cargo.cd_cargo}>
                      {cargo.ds_cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Text search */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Search className="w-3.5 h-3.5" />
                Busca por texto
              </label>
              <Input
                placeholder="Nome, partido, número..."
                value={filters.busca}
                onChange={(e) => setFilter('busca', e.target.value)}
                className="bg-background"
              />
            </div>

            {/* Sort */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Ordenação
              </label>
              <Select
                value={filters.ordenacao}
                onValueChange={(v) => setFilter('ordenacao', v as 'maior' | 'menor' | 'az')}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="maior">Maior patrimônio</SelectItem>
                  <SelectItem value="menor">Menor patrimônio</SelectItem>
                  <SelectItem value="az">Ordem alfabética (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
