# 🗳️ Candidato Transparente

Uma aplicação web moderna para consulta de patrimônio de candidatos às eleições brasileiras, utilizando dados públicos do Tribunal Superior Eleitoral (TSE).

## 📋 Sobre o Projeto

O **Candidato Transparente** é uma ferramenta de transparência eleitoral que permite aos cidadãos consultar e analisar o patrimônio declarado pelos candidatos nas eleições brasileiras. A aplicação processa dados públicos do TSE e oferece uma interface intuitiva para busca, filtragem e visualização dessas informações.

### ✨ Funcionalidades

- 🔍 **Busca avançada** por candidatos com filtros por:
  - Ano da eleição
  - Região e Estado (UF)
  - Município
  - Cargo
  - Nome do candidato ou partido
  
- 📊 **Visualização de dados**:
  - Tabela interativa com todos os candidatos
  - Detalhamento completo do patrimônio por candidato
  - Ordenação por maior/menor patrimônio ou ordem alfabética
  
- ⚡ **Performance otimizada**:
  - Processamento de dados em Web Workers
  - Cache local usando IndexedDB
  - Carregamento progressivo de arquivos CSV grandes
  
- 🎨 **Interface moderna**:
  - Design responsivo com Tailwind CSS
  - Componentes acessíveis usando Radix UI
  - Animações suaves com Framer Motion
  - Suporte a tema claro/escuro

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server rápido
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Componentes acessíveis e sem estilo
- **Framer Motion** - Biblioteca de animações
- **React Query** - Gerenciamento de estado do servidor
- **PapaParse** - Parser de arquivos CSV
- **IndexedDB (idb)** - Armazenamento local de dados

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ ou Bun
- npm, yarn ou bun

### Passos

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd candidato-transparente
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
bun install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

4. Acesse a aplicação em `http://localhost:8080`

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run build:dev` - Cria build em modo desenvolvimento
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo watch

## 📁 Estrutura do Projeto

```
candidato-transparente/
├── public/
│   └── data/
│       └── 2024/
│           ├── bens/          # Arquivos CSV de bens dos candidatos
│           └── consulta/       # Arquivos CSV de consulta de candidatos
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── AppHeader.tsx
│   │   └── AppFooter.tsx
│   ├── features/
│   │   └── search/             # Feature de busca
│   │       ├── SearchContainer.tsx
│   │       ├── FilterPanel.tsx
│   │       ├── CandidateTable.tsx
│   │       └── CandidateModal.tsx
│   ├── hooks/                  # Custom hooks
│   │   ├── useDataProcessor.ts
│   │   ├── useFilters.ts
│   │   └── useDebounce.ts
│   ├── data/                   # Utilitários de dados
│   │   ├── constants.ts
│   │   ├── download.ts
│   │   └── parse.ts
│   ├── types/                  # Definições TypeScript
│   │   └── tse.ts
│   └── pages/
│       └── Index.tsx
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 📊 Dados

A aplicação utiliza dados públicos do TSE disponíveis em formato CSV:

- **CONSULTA_CAND**: Dados dos candidatos (nome, partido, cargo, etc.)
- **BEM_CANDIDATO**: Dados de patrimônio declarado pelos candidatos

Os arquivos são organizados por ano e estado (UF), e são processados localmente no navegador para garantir privacidade e performance.

## 🔧 Configuração

### Variáveis de Ambiente

Não são necessárias variáveis de ambiente para o funcionamento básico da aplicação. Todos os dados são carregados localmente a partir dos arquivos CSV na pasta `public/data`.

### Porta do Servidor

A porta padrão é `8080`. Para alterar, edite o arquivo `vite.config.ts`:

```typescript
server: {
  port: 8080, // Altere aqui
}
```

## 🧪 Testes

Execute os testes com:

```bash
npm run test
```

Para executar em modo watch:

```bash
npm run test:watch
```

## 📝 Licença

Este projeto utiliza dados públicos do TSE e é desenvolvido para fins educacionais e de transparência pública.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

Desenvolvido com ❤️ para promover transparência eleitoral no Brasil
