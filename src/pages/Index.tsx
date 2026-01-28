import { useState } from 'react';
import { Building2, Search, Calendar, MapPin, User, X, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ANOS = [2024, 2022, 2020, 2018];
const UFS = [
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'MG', nome: 'Minas Gerais' },
];

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const Index = () => {
  const [ano, setAno] = useState('2024');
  const [uf, setUf] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const handleSearch = async () => {
    if (!ano || !uf) return;
    setLoading(true);
    // Mock data demo
    setTimeout(() => {
      setData([
        { id: '1', nome: 'MARIA SILVA', partido: 'PT', municipio: 'SÃO PAULO', cargo: 'PREFEITO', total: 1015000 },
        { id: '2', nome: 'JOSÉ SANTOS', partido: 'PSDB', municipio: 'SÃO PAULO', cargo: 'PREFEITO', total: 3455000 },
        { id: '3', nome: 'ROBERTO ALMEIDA', partido: 'MDB', municipio: 'CAMPINAS', cargo: 'PREFEITO', total: 19980000 },
      ].sort((a, b) => b.total - a.total));
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary-foreground" />
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">TSE Bens</h1>
            <p className="text-sm text-primary-foreground/70">Patrimônio de Candidatos</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <div className="bg-card border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Calendar className="w-3 h-3"/>Ano</label>
              <Select value={ano} onValueChange={setAno}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent className="bg-popover border z-50">
                  {ANOS.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><MapPin className="w-3 h-3"/>Estado</label>
              <Select value={uf} onValueChange={setUf}>
                <SelectTrigger><SelectValue placeholder="Selecione"/></SelectTrigger>
                <SelectContent className="bg-popover border z-50">
                  {UFS.map(u => <SelectItem key={u.sigla} value={u.sigla}>{u.sigla} - {u.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 flex items-end gap-2">
              <Button onClick={handleSearch} disabled={!uf || loading} className="flex-1">
                <Search className="w-4 h-4 mr-2"/>{loading ? 'Carregando...' : 'Buscar'}
              </Button>
              <Button variant="outline" size="icon" onClick={() => { setUf(''); setData([]); }}><RotateCcw className="w-4 h-4"/></Button>
            </div>
          </div>
        </div>

        {data.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-muted text-xs font-semibold uppercase">
              <div className="col-span-2">Candidato</div>
              <div>Município</div>
              <div>Cargo</div>
              <div className="text-right">Total</div>
            </div>
            {data.map(c => (
              <button key={c.id} onClick={() => setSelected(c)} className="w-full grid grid-cols-5 gap-2 px-4 py-3 hover:bg-muted/50 border-t text-left">
                <div className="col-span-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary"/>
                  <span className="font-medium">{c.nome}</span>
                  <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">{c.partido}</span>
                </div>
                <div className="text-muted-foreground text-sm">{c.municipio}</div>
                <div className="text-muted-foreground text-sm">{c.cargo}</div>
                <div className="text-right font-mono font-semibold text-success">{formatCurrency(c.total)}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-5xl mb-4">🗳️</div>
            <p className="font-medium">Selecione um ano e estado para buscar dados</p>
          </div>
        )}
      </main>

      <footer className="bg-muted/50 border-t py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3"/><span>Fonte: TSE (Dados Abertos). CSV Latin-1, #NULO/-1, #NE/-3.</span>
        </div>
      </footer>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{selected.nome}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelected(null)}><X className="w-5 h-5"/></Button>
            </div>
            <div className="text-center py-4 bg-muted rounded-lg mb-4">
              <p className="text-2xl font-bold text-success">{formatCurrency(selected.total)}</p>
              <p className="text-sm text-muted-foreground">{selected.partido} • {selected.cargo}</p>
            </div>
            <Button className="w-full" onClick={() => setSelected(null)}>Fechar</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
