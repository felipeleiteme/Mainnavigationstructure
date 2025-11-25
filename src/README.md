# 🌱 Mynis

**My Ministry - Ferramenta pessoal para organização do ministério de Testemunhas de Jeová**

<div align="center">

![Version](https://img.shields.io/badge/version-4.0-4A2C60)
![Status](https://img.shields.io/badge/status-production-C8E046)
![License](https://img.shields.io/badge/license-private-4A2C60)
![Tech](https://img.shields.io/badge/React-18-61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38BDF8)

</div>

---

## 📋 Sobre o Projeto

**Mynis** (My Ministry) é um aplicativo web progressivo (PWA) desenvolvido para ajudar publicadores das Testemunhas de Jeová a organizar e acompanhar suas atividades de ministério com foco em:

- 🌱 **Gerenciamento de estudos bíblicos** - Acompanhamento completo de estudantes
- 🏠 **Acompanhamento de revisitas** - Histórico detalhado de visitas e conversas
- 📖 **Diário espiritual** - Gratidão, alvos e leitura bíblica
- 📊 **Estatísticas de campo** - Relatórios mensais e progresso
- 🔒 **Privacidade total** - Dados 100% locais, sem servidor externo

---

## ✨ Características Principais

### 🏠 Tela Inicial
- Dashboard com resumo de atividades do mês
- Próximas ações inteligentes baseadas em dados
- Cadastro rápido de tempo de serviço
- Visualização de sessão ativa em tempo real

### 📖 Campo (Revisitas)
- Cadastro completo de pessoas interessadas
- Sistema de status visual (Nova, Quente, Comércio, Descanso)
- Histórico detalhado de visitas com observações
- Badge especial para interesse em estudar
- Conversão direta para estudo bíblico
- Registro de publicações entregues

### 📚 Estudos Bíblicos
- Gestão de estudantes com avatar personalizado
- Controle de progresso e status
- Informações de contato e localização
- Sessões de estudo com observações
- Estatísticas de progresso

### 🌱 Espiritual
- **Alvos Espirituais** - Metas pessoais com acompanhamento
- **Leitura da Bíblia** - Plano de leitura com cronograma visual
- **Diário de Gratidão** - Registro de experiências e bênçãos
- **Tema do Mês** - Qualidade espiritual com experiências

### 👤 Perfil
- Múltiplos perfis (Publicador, Pioneiro Auxiliar, Pioneiro Regular, Missionário)
- Informações pessoais editáveis
- Avatar personalizado com 50+ opções
- Backup e restauração de dados
- Texto motivacional do ano

---

## 🎨 Design System

O Mynis utiliza o conceito **"Botânica Geométrica"** - crescimento espiritual como cultivo de relacionamentos.

### Paleta de Cores (Brandbook Oficial)

| Cor | Hex | Uso |
|-----|-----|-----|
| **Roxo Profundo** | `#4A2C60` | Headers, navegação, botões principais |
| **Verde Lima** | `#C8E046` | FABs, ações, destaques, crescimento |
| **Creme** | `#FDF8EE` | Fundo da aplicação |
| **Erro** | `#F44336` | Mensagens de erro e alertas |

### Conceito Visual

- 🌱 **Verde** = Crescimento, novo, vida
- 🔥 **Laranja** = Urgência, prioridade
- 💜 **Roxo** = Espiritualidade, profundidade

### Tipografia

**Fonte Única:** Inter (Google Fonts)
- **H1:** Inter Bold (28px)
- **H2:** Inter Bold (24px)
- **H3:** Inter Semibold (20px)
- **Corpo:** Inter Regular (16px mínimo mobile)
- **Caption:** Inter Regular (12px)

### Espaçamentos (Grid 8pt)

```css
xxs: 4px   xs: 8px   sm: 16px (padrão)
md: 24px   lg: 32px  xl: 48px   xxl: 64px
```

### Ícones

- **Biblioteca:** lucide-react (vetoriais, não emojis)
- **Tamanhos:** 24px (padrão), 16px (inline), 32px (FABs)

---

## 🏗️ Arquitetura

### Stack Tecnológico

- **React 18** - Interface de usuário com hooks
- **TypeScript** - Tipagem estática e type safety
- **Tailwind CSS 4.0** - Framework CSS utility-first
- **ShadCN UI** - Componentes acessíveis e customizáveis
- **Lucide React** - Ícones vetoriais consistentes
- **Sonner** - Toast notifications elegantes
- **LocalStorage** - Persistência de dados 100% local

### DataService - Fonte Única de Verdade

O projeto utiliza um padrão arquitetural centralizado:

```typescript
// services/dataService.ts
class DataService {
  // CRUD para todas entidades
  getEstudos(): Estudo[]
  adicionarEstudo(estudo: Omit<Estudo, 'id'>): Estudo
  atualizarEstudo(id: string, estudo: Estudo): void
  removerEstudo(id: string): void
  
  // Sistema de eventos
  emitChange(tipo: string): void
  on(evento: string, callback: Function): void
  off(evento: string, callback: Function): void
}
```

**Sincronização Automática:**
```typescript
useEffect(() => {
  const carregar = () => setDados(DataService.getDados());
  carregar();
  DataService.on('mynis-data-change', carregar);
  return () => DataService.off('mynis-data-change', carregar);
}, []);
```

### Estrutura do Projeto

```
mynis/
├── components/
│   ├── tabs/              # 5 abas principais
│   │   ├── InicioTab.tsx
│   │   ├── CampoTab.tsx
│   │   ├── EstudosTab.tsx
│   │   ├── EspiritualTab.tsx
│   │   └── PerfilTab.tsx
│   ├── pages/             # Páginas full-screen
│   ├── shared/            # Componentes compartilhados
│   │   ├── FAB.tsx       # Floating Action Button
│   │   ├── EmptyState.tsx
│   │   └── ...
│   └── ui/                # ShadCN UI components (40+ componentes)
├── services/
│   ├── dataService.ts     # Fonte única de verdade
│   └── seedData.ts        # Dados iniciais
├── utils/
│   ├── helpers/           # Funções auxiliares
│   ├── notifications/     # Sistema de notificações
│   └── storage/           # Gerenciamento de localStorage
├── styles/
│   ├── globals.css        # Estilos globais + Tailwind v4
│   └── design-tokens.css  # Tokens do design system
├── data/
│   └── qualidades.ts      # Qualidades espirituais
└── guidelines/
    └── Guidelines.md      # Guia completo para IA
```

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd mynis

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build de Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

---

## 📱 Funcionalidades Detalhadas

### Sistema de Cadastro de Tempo
- **Cadastro Manual** - Formulário completo com data, período e duração
- **Tipos de Atividade** - Campo, Crédito (15min), Estudo Pessoal
- **Detalhamento** - Revisitas, casa-em-casa, testemunho público, estudo
- **Publicações** - Registro de revistas, brochuras, livros, tratados
- **Vídeos** - Registro de vídeos mostrados com reação

### Sistema de Relatórios
- **Progresso Visual** - Cards com progresso de cada métrica
- **Estatísticas Mensais** - Horas, publicações, vídeos, revisitas, estudos
- **Histórico de Sessões** - Lista completa de atividades cadastradas
- **Envio de Relatório** - Formulário completo para envio mensal

### Sistema de Revisitas
- **4 Status Visuais:**
  - 🌱 Nova - Verde (pessoa recém-contatada)
  - 🔥 Quente - Laranja (interesse demonstrado)
  - 🏪 Comércio - Azul (estabelecimento comercial)
  - 💤 Descanso - Cinza (temporariamente inativo)
- **Badge Especial** - ⭐ Interesse em estudar
- **Histórico de Visitas** - Cada visita com data, observações e publicações
- **Conversão para Estudo** - Botão "Iniciar Estudo" preserva dados

### Sistema de Estudos
- **4 Status de Progresso:**
  - 🌱 Iniciando - Verde
  - 📈 Progredindo - Azul
  - 🤔 Dúvidas - Laranja
  - ⭐ Avançado - Roxo
- **Informações Completas** - Nome, contato, endereço, publicação
- **Avatar Personalizado** - 50+ opções visuais
- **Observações** - Anotações sobre cada estudante

### Sistema de Leitura Bíblica
- **3 Planos Disponíveis:**
  - 📖 Cronológico - Ordem dos eventos bíblicos
  - 📚 Sequencial - Ordem tradicional dos livros
  - ⚡ Intensivo - Leitura rápida (2x/dia)
- **Progresso Visual** - Barra de progresso e estatísticas
- **Cronograma Interativo** - Visualização de dias pendentes/lidos
- **Marcação Simples** - Um toque para marcar como lido

### Sistema de Alvos Espirituais
- **Categorias:**
  - 🎯 Campo - Revisitas, estudos, horas
  - 📖 Espiritual - Leitura, estudo pessoal
  - 🤝 Pessoal - Qualidades, relacionamentos
- **Progresso Visual** - Barra de progresso animada
- **Prazos** - Data limite com contador regressivo
- **Status** - Em Progresso, Concluído, Atrasado

---

## 🔐 Privacidade e Segurança

### Dados 100% Locais

- ✅ **Armazenamento Local** - Todos os dados ficam no localStorage do navegador
- ✅ **Sem Backend** - Não há servidor externo coletando dados
- ✅ **Sem Rastreamento** - Zero analytics ou tracking
- ✅ **Sem Monetização** - Não vendemos ou compartilhamos dados
- ✅ **Controle Total** - Você é dono completo dos seus dados

### Backup e Restauração

- 📦 **Export JSON** - Exporta todos os dados em formato JSON
- 📥 **Import JSON** - Restaura dados de backup anterior
- 🗑️ **Limpeza de Dados** - Opção de excluir todos os dados

### Importante

⚠️ **O Mynis não é adequado para:**
- Coleta de dados sensíveis de outras pessoas
- Compartilhamento de informações com terceiros
- Uso institucional ou organizacional

✅ **O Mynis é ideal para:**
- Organização pessoal do ministério
- Caderno digital privado
- Acompanhamento individual de atividades

---

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build de produção otimizado
npm run build

# Preview do build de produção
npm run preview

# Linting do código
npm run lint
```

### Padrões de Código

**TypeScript Strict Mode** - Todas as interfaces são tipadas:
```typescript
interface Estudo {
  id: string;
  estudanteNome: string;
  estudanteAvatar?: string;
  publicacao: string;
  status: 'iniciando' | 'progredindo' | 'duvidas' | 'avancado';
  // ...
}
```

**Componentes Funcionais** - Sempre usar hooks:
```typescript
export default function ComponentName() {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Side effects
  }, []);
  
  return <div>...</div>;
}
```

**Tailwind Classes** - Seguir o brandbook:
```typescript
// ✅ Correto
<Button className="w-full h-14 text-white hover:opacity-90 border-0" 
        style={{ backgroundColor: '#4A2C60' }}>

// ❌ Incorreto - não usar classes de tipografia
<h1 className="text-2xl font-bold">  // Não usar text-2xl, font-bold
```

### Estrutura de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona sistema de relatórios completo
fix: corrige bug na conversão de revisita para estudo
docs: atualiza README com novas funcionalidades
style: ajusta espaçamentos no formulário de estudo
refactor: migra DataService para padrão singleton
perf: otimiza renderização de lista de revisitas
test: adiciona testes para DataService
chore: atualiza dependências do projeto
```

---

## 📚 Documentação

### Documentação Principal

- **[Guidelines.md](./guidelines/Guidelines.md)** - Guia completo para IA e desenvolvimento
- **[QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)** - Referência rápida
- **[INDEX.md](./docs/INDEX.md)** - Índice completo da documentação

### Documentação do Projeto

- **[BRANDBOOK.md](./docs/project/BRANDBOOK.md)** - Identidade visual oficial
- **[DESIGN_SYSTEM.md](./docs/project/DESIGN_SYSTEM.md)** - Sistema de design completo
- **[ARCHITECTURE.md](./docs/project/ARCHITECTURE.md)** - Arquitetura detalhada

### Desenvolvimento

- **[GUIDELINES.md](./docs/development/GUIDELINES.md)** - Padrões de desenvolvimento
- **[CHANGELOG.md](./docs/development/CHANGELOG.md)** - Histórico de versões
- **[CONTRIBUTING.md](./docs/development/CONTRIBUTING.md)** - Como contribuir

---

## 📈 Roadmap

### ✅ Versão 4.0 (Atual - Novembro 2025)

**Funcionalidades Principais:**
- ✅ Sistema completo de revisitas com 4 status
- ✅ Gestão de estudos bíblicos com progresso visual
- ✅ Cadastro de tempo de serviço detalhado
- ✅ Relatórios mensais com estatísticas
- ✅ Sistema de alvos espirituais
- ✅ Plano de leitura bíblica (3 modalidades)
- ✅ Diário de gratidão com filtros
- ✅ Tema do mês com qualidades espirituais
- ✅ Backup e restauração de dados
- ✅ 5 perfis de publicador
- ✅ Avatar personalizado (50+ opções)

**Arquitetura:**
- ✅ DataService implementado e funcionando
- ✅ Sincronização bidirecional automática
- ✅ Validações robustas em todos formulários
- ✅ Toast notifications em todas ações
- ✅ Design system 100% alinhado ao brandbook
- ✅ 40+ componentes ShadCN integrados
- ✅ Navegação bottom tabs otimizada

### 🔄 Próximas Features (v4.1+)

**Melhorias de UX:**
- 🔄 Sistema de notificações push
- 🔄 Modo offline completo (PWA)
- 🔄 Animações de transição entre telas
- 🔄 Gestos de swipe em cards

**Novas Funcionalidades:**
- 📊 Dashboard de estatísticas avançadas
- 🗺️ Visualização de revisitas em mapa
- 📤 Compartilhamento de relatórios via WhatsApp
- 🔔 Lembretes de próximas visitas
- 📅 Integração com calendário

**Técnico:**
- 🌐 Sincronização entre dispositivos (opcional)
- 📱 App mobile nativo (iOS/Android)
- 🎨 Temas personalizáveis
- 🌍 Internacionalização (PT, EN, ES)

---

## 🎯 Princípios de Design

### Design Emocional

O Mynis foi desenvolvido seguindo princípios de **design emocional** para criar uma experiência:

- 🌱 **Orgânica** - Inspirada na natureza e crescimento (conceito botânico)
- 💜 **Acolhedora** - Interface amigável e convidativa
- ✨ **Motivadora** - Incentiva o progresso constante
- 🎨 **Consistente** - Padrões visuais claros em todas as telas
- 🎯 **Focada** - Prioriza o essencial, sem distrações

### Acessibilidade

- ✅ Contraste de cores WCAG AAA
- ✅ Navegação por teclado completa
- ✅ Leitores de tela compatíveis
- ✅ Textos alternativos em todas imagens
- ✅ Ícones vetoriais (lucide-react) para clareza
- ✅ Tamanhos de toque adequados (min 44px)
- ✅ Feedback visual em todas interações

### Performance

- ⚡ Build otimizado com Vite
- ⚡ Code splitting automático
- ⚡ Lazy loading de componentes
- ⚡ LocalStorage otimizado
- ⚡ Renderização condicional eficiente

---

## 🧪 Testes

### Cobertura de Testes

- ✅ DataService - Todos os métodos CRUD testados
- ✅ Sincronização de dados
- ✅ Validações de formulários
- ✅ Navegação entre telas
- ✅ Backup e restauração

### Como Testar

```bash
# Rodar testes unitários
npm run test

# Rodar testes com coverage
npm run test:coverage

# Rodar testes em watch mode
npm run test:watch
```

---

## 🤝 Contribuindo

Por ser um projeto privado, contribuições são limitadas. Mas você pode:

1. **Reportar Bugs** - Abra uma issue descrevendo o problema
2. **Sugerir Features** - Compartilhe ideias de melhorias
3. **Melhorar Documentação** - Corrija ou adicione informações

Leia o [CONTRIBUTING.md](./docs/development/CONTRIBUTING.md) para mais detalhes.

---

## 📄 Licença

Este é um projeto privado desenvolvido para uso pessoal de publicadores das Testemunhas de Jeová. Todos os direitos reservados.

**Uso Permitido:**
- ✅ Uso pessoal para organização do ministério
- ✅ Fork privado para personalização

**Uso Não Permitido:**
- ❌ Redistribuição comercial
- ❌ Uso institucional sem autorização
- ❌ Modificação para fins lucrativos

---

## 🙏 Agradecimentos

Agradecimentos especiais a:

- Todos os publicadores que testaram e deram feedback
- Comunidade React e Tailwind CSS
- Desenvolvedores do ShadCN UI e Lucide React
- Equipe do Vite por uma ferramenta incrível

---

## 📞 Contato

Para dúvidas, sugestões ou reportar problemas:

- 📧 Email: [seu-email]
- 🐛 Issues: [GitHub Issues]
- 💬 Discussões: [GitHub Discussions]

---

<div align="center">

**Feito com 💜 para ajudar publicadores em seu ministério**

[📚 Documentação](./docs/) • [🎨 Design System](./docs/project/DESIGN_SYSTEM.md) • [🏗️ Arquitetura](./docs/project/ARCHITECTURE.md)

---

### 🌱 "Plante as sementes da verdade e cultive relacionamentos duradouros"

**Mynis v4.0** - Lançamento Completo | Novembro 2025

</div>
