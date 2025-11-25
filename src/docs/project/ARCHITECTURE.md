# 🏗️ Arquitetura - Mynis

**Documentação técnica da arquitetura do aplicativo Mynis**

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Camada de Dados](#camada-de-dados)
5. [Componentes](#componentes)
6. [Roteamento](#roteamento)
7. [Estado e Persistência](#estado-e-persistência)
8. [Design Patterns](#design-patterns)

---

## 🎯 Visão Geral

O Mynis é um **Progressive Web App (PWA)** desenvolvido com React, focado em:

- **100% Local**: Todos os dados ficam no navegador (localStorage)
- **Zero Backend**: Não há servidor ou API externa
- **Offline-First**: Funciona completamente offline
- **Mobile-First**: Interface otimizada para dispositivos móveis

### Conceito Arquitetural

```
┌─────────────────────────────────────┐
│         Interface (React)           │
│  ┌─────────────────────────────┐   │
│  │   5 Tabs Principais         │   │
│  │  (Início, Campo, Estudos,   │   │
│  │   Espiritual, Perfil)       │   │
│  └─────────────────────────────┘   │
│               ↕                     │
│  ┌─────────────────────────────┐   │
│  │    DataService (Core)       │   │
│  │  - CRUD Operations          │   │
│  │  - Event System             │   │
│  │  - Data Validation          │   │
│  └─────────────────────────────┘   │
│               ↕                     │
│  ┌─────────────────────────────┐   │
│  │   localStorage (Browser)    │   │
│  │  - Revisitas                │   │
│  │  - Estudos                  │   │
│  │  - Relatórios               │   │
│  │  - Alvos Espirituais        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Core
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server

### Estilo
- **Tailwind CSS 4.0** - Framework CSS utility-first
- **ShadCN UI** - Componentes acessíveis
- **Lucide React** - Ícones vetoriais

### Roteamento
- **React Router** - Navegação entre páginas
- **Bottom Tab Navigation** - 5 tabs principais

### Persistência
- **localStorage** - Armazenamento de dados
- **Custom Events** - Sincronização entre componentes

---

## 📁 Estrutura de Pastas

```
mynis/
├── components/
│   ├── tabs/                    # 5 Tabs principais
│   │   ├── InicioTab.tsx
│   │   ├── CampoTab.tsx
│   │   ├── EstudosTab.tsx
│   │   ├── EspiritualTab.tsx
│   │   └── PerfilTab.tsx
│   │
│   ├── pages/                   # Páginas full-screen
│   │   ├── NovaRevisitaPage.tsx
│   │   ├── DetalhesRevisitaPage.tsx
│   │   ├── RegistrarVisitaPage.tsx
│   │   ├── NovoEstudoPage.tsx
│   │   ├── DetalhesEstudoPage.tsx
│   │   ├── CadastrarTempoPage.tsx
│   │   ├── EnviarRelatorioPage.tsx
│   │   ├── RelatorioCompletoPage.tsx
│   │   ├── AlvosEspirituaisPage.tsx
│   │   ├── NovoAlvoPage.tsx
│   │   ├── DiarioGratidaoPage.tsx
│   │   ├── NovaGratidaoPage.tsx
│   │   ├── LeituraBibliaPage.tsx
│   │   ├── ConfiguracoesLeituraPage.tsx
│   │   ├── EstatisticasPage.tsx
│   │   ├── ProgressoPage.tsx
│   │   ├── CronogramaPage.tsx
│   │   ├── EditarInformacoesPage.tsx
│   │   ├── EditarFotoPerfilPage.tsx
│   │   ├── EditarEmergenciaPage.tsx
│   │   ├── EditarTipoPublicadorPage.tsx
│   │   └── EditarTextoAnoPage.tsx
│   │
│   ├── shared/                  # Componentes compartilhados
│   │   ├── BarraSessao.tsx
│   │   ├── ControlesSessaoModal.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FAB.tsx
│   │   ├── HorizontalFilterList.tsx
│   │   ├── IniciarSessaoModal.tsx
│   │   ├── ResumoSessaoModal.tsx
│   │   └── TrocarPerfilModal.tsx
│   │
│   ├── inicio/                  # Componentes da aba Início
│   │   ├── DashboardEmptyState.tsx
│   │   └── ProximasAcoes.tsx
│   │
│   ├── estatisticas/            # Componentes de estatísticas
│   │   ├── EstudosDetalhes.tsx
│   │   ├── PublicacoesDetalhes.tsx
│   │   ├── RevisitasDetalhes.tsx
│   │   └── VideosDetalhes.tsx
│   │
│   ├── estudos/                 # Componentes de estudos
│   │   └── FormularioEstudo.tsx
│   │
│   ├── cronograma/              # Componentes de cronograma
│   │   └── DiaDetalhes.tsx
│   │
│   ├── leitura/                 # Componentes de leitura bíblica
│   │   ├── EmptyStateLeitura.tsx
│   │   ├── MarcarLeituraDialog.tsx
│   │   └── OnboardingLeitura.tsx
│   │
│   ├── onboarding/              # Onboarding inicial
│   │   └── OnboardingFlow.tsx
│   │
│   ├── backup/                  # Sistema de backup
│   │   └── BackupCard.tsx
│   │
│   ├── tema-mes/                # Tema do mês
│   │   ├── TemaDoMes.tsx
│   │   └── RegistrarExperienciaModal.tsx
│   │
│   ├── perfil/                  # Componentes de perfil
│   │   └── EditarTipoPublicadorModal.tsx
│   │
│   ├── notifications/           # Sistema de notificações
│   │   └── NotificationDemo.tsx
│   │
│   ├── ui/                      # ShadCN UI (protegidos)
│   │   └── [100+ componentes]
│   │
│   ├── figma/                   # Componentes Figma (protegidos)
│   │   └── ImageWithFallback.tsx
│   │
│   └── ConfettiEffect.tsx       # Efeito de confete
│
├── services/                    # Lógica de negócio
│   ├── dataService.ts           # Serviço principal de dados
│   └── seedData.ts              # Dados de exemplo/seed
│
├── utils/                       # Utilitários
│   ├── atividadeIcons.tsx       # Ícones de atividades
│   ├── leituraStorage.ts        # Storage de leitura
│   ├── notifications.ts         # Sistema de notificações
│   ├── sessaoNotification.ts    # Notificações de sessão
│   └── proximasAcoes.ts         # Lógica de próximas ações
│
├── data/                        # Dados estáticos
│   └── qualidades.ts            # Lista de qualidades
│
├── styles/                      # Estilos globais
│   ├── globals.css              # Estilos globais
│   └── design-tokens.css        # Tokens de design
│
├── docs/                        # Documentação
│   ├── INDEX.md
│   ├── project/
│   ├── development/
│   ├── audits/
│   └── progress/
│
└── App.tsx                      # Entrypoint
```

---

## 💾 Camada de Dados

### DataService (`/services/dataService.ts`)

**Responsabilidade:** Gerenciar TODAS as operações de dados do app

#### Entidades Principais

```typescript
interface Revisita {
  id: string;
  nome: string;
  telefone?: string;
  endereco: string;
  origem: 'testemunho' | 'carta' | 'telefone' | 'informal';
  primeiraConversa: string;
  publicacoesEntregues: Array<{
    id: string;
    nome: string;
    tipo: 'revista' | 'brochura' | 'livro' | 'folheto';
  }>;
  status: 'ativa' | 'inativa' | 'pausada';
  interesseEstudar: boolean;
  historico: Array<{
    id: string;
    data: string;
    tipo: 'visita' | 'conversa' | 'publicacao';
    notas: string;
  }>;
  criadaEm: string;
}

interface Estudo {
  id: string;
  nome: string;
  telefone?: string;
  dataInicio: string;
  publicacaoEstudada: string;
  horarioHabitual?: string;
  sessoes: Array<{
    id: string;
    data: string;
    capitulo: string;
    progresso: number;
    presentes?: string[];
    notas?: string;
  }>;
  qualidades: string[];
  status: 'ativo' | 'concluido' | 'pausado';
  criadoEm: string;
}

interface Relatorio {
  id: string;
  mes: string;
  ano: number;
  horas: number;
  minutos: number;
  publicacoes: number;
  videos: number;
  revisitas: number;
  estudos: number;
  observacoes?: string;
  enviado: boolean;
  criadoEm: string;
}

interface AlvoEspiritual {
  id: string;
  titulo: string;
  descricao?: string;
  categoria: 'leitura' | 'pregacao' | 'servico' | 'pessoal';
  meta: number;
  progresso: number;
  unidade: string;
  dataInicio: string;
  dataAlvo?: string;
  concluido: boolean;
  criadoEm: string;
}
```

#### Métodos Principais

```typescript
class DataService {
  // REVISITAS
  static getRevisitas(): Revisita[]
  static adicionarRevisita(revisita: Omit<Revisita, 'id' | 'criadaEm'>): Revisita
  static atualizarRevisita(id: string, data: Partial<Revisita>): void
  static deletarRevisita(id: string): void
  
  // ESTUDOS
  static getEstudos(): Estudo[]
  static adicionarEstudo(estudo: Omit<Estudo, 'id' | 'criadoEm'>): Estudo
  static atualizarEstudo(id: string, data: Partial<Estudo>): void
  static deletarEstudo(id: string): void
  
  // RELATÓRIOS
  static getRelatorios(): Relatorio[]
  static adicionarRelatorio(relatorio: Omit<Relatorio, 'id' | 'criadoEm'>): Relatorio
  static atualizarRelatorio(id: string, data: Partial<Relatorio>): void
  
  // ALVOS ESPIRITUAIS
  static getAlvos(): AlvoEspiritual[]
  static adicionarAlvo(alvo: Omit<AlvoEspiritual, 'id' | 'criadoEm'>): AlvoEspiritual
  static atualizarAlvo(id: string, data: Partial<AlvoEspiritual>): void
  static deletarAlvo(id: string): void
  
  // EVENTOS
  static addEventListener(callback: () => void): void
  static removeEventListener(callback: () => void): void
}
```

#### Sistema de Eventos

O DataService dispara eventos personalizados sempre que há mudanças:

```typescript
// Ao modificar dados
window.dispatchEvent(new Event('mynis-data-change'));

// Componentes ouvem mudanças
useEffect(() => {
  const handleChange = () => {
    // Recarregar dados
  };
  
  window.addEventListener('mynis-data-change', handleChange);
  return () => window.removeEventListener('mynis-data-change', handleChange);
}, []);
```

---

## 🧩 Componentes

### Hierarquia de Componentes

```
App.tsx
└── [5 Tabs Principais]
    ├── InicioTab
    │   ├── DashboardEmptyState
    │   ├── ProximasAcoes
    │   └── TemaDoMes
    │
    ├── CampoTab
    │   ├── [Lista de Revisitas]
    │   ├── FAB → NovaRevisitaPage
    │   └── Card → DetalhesRevisitaPage
    │
    ├── EstudosTab
    │   ├── [Lista de Estudos]
    │   ├── FAB → NovoEstudoPage
    │   └── Card → DetalhesEstudoPage
    │
    ├── EspiritualTab
    │   ├── AlvosEspirituais
    │   ├── DiarioGratidao
    │   └── LeituraBiblia
    │
    └── PerfilTab
        ├── Informações Pessoais
        ├── Relatórios
        ├── Configurações
        └── Backup
```

### Padrões de Componentes

#### 1. Tabs (Telas Principais)
- Altura total da viewport
- Bottom navigation sempre visível
- Scroll interno quando necessário

#### 2. Pages (Telas Full-Screen)
- Header sticky no topo
- Botão de voltar obrigatório
- Ocupam 100vh
- Sobrepõem bottom navigation

#### 3. Modals/Dialogs
- Overlay escuro
- Fecham ao clicar fora
- Botão X no canto superior direito

---

## 🚦 Roteamento

### Navegação Bottom Tab

```typescript
// 5 tabs principais (sempre visíveis)
const tabs = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'campo', label: 'Campo', icon: Users },
  { id: 'estudos', label: 'Estudos', icon: BookOpen },
  { id: 'espiritual', label: 'Espiritual', icon: Target },
  { id: 'perfil', label: 'Perfil', icon: User }
];
```

### Navegação de Páginas

Usa sistema de "back navigation" com controle de histórico:

```typescript
// Abrir página
setActiveView('NovaRevisitaPage');

// Voltar
handleVoltar() → volta para tab anterior
```

---

## 💿 Estado e Persistência

### localStorage Keys

```typescript
// Dados principais
'mynis-revisitas'          // Array<Revisita>
'mynis-estudos'            // Array<Estudo>
'mynis-relatorios'         // Array<Relatorio>
'mynis-alvos'              // Array<AlvoEspiritual>
'mynis-leitura-biblia'     // LeituraProgress
'mynis-diario-gratidao'    // Array<Gratidao>

// Configurações
'mynis-onboarding-completed'  // boolean
'mynis-user-profile'          // UserProfile
'mynis-notifications'         // NotificationSettings
```

### Sincronização de Estado

```typescript
// Ao modificar dados
DataService.atualizarRevisita(id, data);
// ↓
// localStorage atualizado
// ↓
// Event 'mynis-data-change' disparado
// ↓
// Componentes ouvindo recarregam
```

---

## 🎨 Design Patterns

### 1. Single Source of Truth
- **DataService** é a única fonte de verdade
- Todos os componentes leem/escrevem através dele
- Zero lógica de dados nos componentes

### 2. Event-Driven Architecture
- Mudanças de dados disparam eventos
- Componentes reagem a eventos
- Desacoplamento entre componentes

### 3. Composition over Inheritance
- Componentes pequenos e reutilizáveis
- Composição de funcionalidades
- Props drilling evitado

### 4. Mobile-First
- Design responsivo por padrão
- Touch-friendly (min 44px)
- Performance otimizada

---

## 📊 Fluxo de Dados

```
┌──────────────────┐
│  User Action     │ (Clique, input, etc.)
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Component       │ (Validação, formatação)
└────────┬─────────┘
         ↓
┌──────────────────┐
│  DataService     │ (CRUD operation)
└────────┬─────────┘
         ↓
┌──────────────────┐
│  localStorage    │ (Persistência)
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Event Dispatch  │ ('mynis-data-change')
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Components      │ (Re-render com novos dados)
└──────────────────┘
```

---

## 🔒 Segurança e Privacidade

- ✅ **100% Local** - Nenhum dado sai do dispositivo
- ✅ **Zero Tracking** - Sem analytics ou telemetria
- ✅ **Sem Backend** - Não há servidor para ser hackeado
- ✅ **Controle Total** - Usuário é dono dos dados

---

## 📚 Referências

**Arquivos Principais:**
- `/App.tsx` - Entrypoint
- `/services/dataService.ts` - Lógica de negócio
- `/components/tabs/*` - Telas principais

**Documentação Relacionada:**
- [Design System](./DESIGN_SYSTEM.md)
- [Guidelines de Desenvolvimento](../development/GUIDELINES.md)

---

**Versão:** 2.0  
**Última Atualização:** 2024  
**Mantido por:** Equipe Mynis
