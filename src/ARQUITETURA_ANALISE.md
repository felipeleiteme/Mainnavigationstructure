# 🏗️ Análise de Arquitetura de Informação - Mynis

## 📊 Status Atual: ANÁLISE CRÍTICA

---

## 🚨 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **DUPLICIDADE E DESCONEXÃO DE DADOS**

#### ❌ Problema: Dados Mockados vs Dados Reais

**Componentes com dados MOCKADOS (não conectados):**
- ✅ `/components/estatisticas/EstudosDetalhes.tsx` - 11 estudos mockados
- ✅ `/components/estatisticas/RevisitasDetalhes.tsx` - 5 revisitas mockadas
- ✅ `/components/estatisticas/PublicacoesDetalhes.tsx` - 12 publicações mockadas
- ✅ `/components/estatisticas/VideosDetalhes.tsx` - 8 vídeos mockados
- ✅ `/components/cronograma/DiaDetalhes.tsx` - Estudos e atividades mockados
- ✅ `/components/tabs/InicioTab.tsx` - Estatísticas e cronograma mockados

**Componentes com dados REAIS (localStorage):**
- ❌ `/components/tabs/EspiritualTab.tsx` - Lê de `diarioEspiritual`
- ❌ `/components/tabs/CampoTab.tsx` - Deve ler `revisitas`
- ❌ `/components/tabs/EstudosTab.tsx` - Deve ler `estudosBiblicos`

**IMPACTO:** As telas de detalhamento mostram números diferentes dos dados reais do usuário!

---

### 2. **FALTA DE FONTE ÚNICA DE VERDADE (SINGLE SOURCE OF TRUTH)**

#### ❌ Problema: Múltiplas definições de "Estudos"

**Onde "estudos" aparecem:**
1. InicioTab - Célula do Dashboard (11 estudos mockados)
2. EstudosDetalhes - Tela de detalhamento (11 estudos mockados)
3. DiaDetalhes - Estudos por dia (mockados)
4. EstudosTab - Tab principal (deveria ser a fonte real)

**SOLUÇÃO NECESSÁRIA:** Criar um serviço centralizado de dados

---

### 3. **NAVEGAÇÕES QUE NÃO FUNCIONAM**

#### ❌ Problema: Botões que não levam a lugar nenhum

**Botões quebrados identificados:**

**EstudosDetalhes.tsx:**
- "Ver Todos os Estudos" → Deveria navegar para EstudosTab
- "Ver Perfil Completo" → Deveria abrir detalhes do estudante
- "Agendar Próximo" → Deveria abrir formulário

**RevisitasDetalhes.tsx:**
- "Ver Todas as Revisitas" → Deveria navegar para CampoTab
- "Ver Detalhes" → Deveria abrir DetalhesRevisita
- "Agendar Próxima Visita" → Deveria abrir calendário

**PublicacoesDetalhes.tsx:**
- "Registrar Nova Publicação" → Deveria abrir formulário
- "Solicitar Publicações" → Link externo JW.org

**VideosDetalhes.tsx:**
- "Registrar Novo Vídeo" → Deveria abrir formulário
- "Catálogo de Vídeos" → Link externo JW.org
- "Baixar para Offline" → Link para JW Library

**DiaDetalhes.tsx:**
- "+ Agendar Estudo" → Deveria navegar para EstudosTab
- "📊 Ver Relatório do Dia" → Deveria abrir relatório
- "✏️ Editar Atividades" → Deveria abrir formulário

---

## 🎯 ARQUITETURA IDEAL PROPOSTA

### 1. **Camada de Dados Centralizada**

```typescript
// /services/dataService.ts

interface AppData {
  // Estudos Bíblicos
  estudos: Estudo[];
  
  // Revisitas
  revisitas: Revisita[];
  
  // Sessões de Campo
  sessoes: Sessao[];
  
  // Diário Espiritual
  diario: DiarioEntry[];
  
  // Alvos Espirituais
  alvos: Alvo[];
  
  // Tema do Mês
  temaExperiencias: TemaExperiencia[];
  
  // Perfis da Família
  perfis: Perfil[];
  perfilAtual: string;
}

class DataService {
  // CRUD para cada entidade
  // Sincronização com localStorage
  // Eventos para mudanças de dados
  // Validações
}
```

### 2. **Fluxo de Dados Unidirecional**

```
localStorage
    ↓
DataService (Single Source of Truth)
    ↓
    ├─→ InicioTab (Dashboard - LEITURA)
    ├─→ EspiritualTab (Diário - LEITURA/ESCRITA)
    ├─→ CampoTab (Revisitas - LEITURA/ESCRITA)
    ├─→ EstudosTab (Estudos - LEITURA/ESCRITA)
    └─→ PerfilTab (Config - LEITURA/ESCRITA)
    
Modals de Detalhamento
    ↓
Recebem dados via props (não mockados)
    ↓
Navegam de volta para tabs principais
```

### 3. **Estrutura de Navegação Correta**

```
InicioTab
  ├─ Card Estudos → EstudosDetalhes (modal)
  │   ├─ "Ver Todos" → fecha modal + navega EstudosTab
  │   └─ "Ver Perfil" → fecha modal + abre DetalhesEstudo
  │
  ├─ Card Revisitas → RevisitasDetalhes (modal)
  │   ├─ "Ver Todas" → fecha modal + navega CampoTab
  │   └─ "Ver Detalhes" → fecha modal + abre DetalhesRevisita
  │
  ├─ Cronograma → DiaDetalhes (modal)
  │   ├─ "Agendar Estudo" → fecha modal + navega EstudosTab
  │   └─ "Iniciar Ministério" → fecha modal + inicia sessão
  │
  └─ Tema do Mês → TemaDoMes (modal fullscreen)
      └─ "Ver Relatório" → fecha modal + navega PerfilTab
```

---

## 🔧 PLANO DE CORREÇÃO

### Fase 1: Criar Serviço de Dados (CRÍTICO)

**Arquivo:** `/services/dataService.ts`

**Responsabilidades:**
- ✅ Interface TypeScript para todas as entidades
- ✅ Métodos CRUD para cada tipo de dado
- ✅ Sincronização automática com localStorage
- ✅ Eventos para mudanças de dados (pub/sub)
- ✅ Validações de dados
- ✅ Métodos de cálculo (estatísticas, agregações)

**Exemplo:**
```typescript
class DataService {
  // Estudos
  getEstudos(): Estudo[]
  getEstudosPorMes(mes: number): Estudo[]
  getTotalEstudosMes(): number
  getEstudantesPorEstudo(): Map<string, Estudo[]>
  
  // Revisitas
  getRevisitas(): Revisita[]
  getRevisitasNovasMes(): Revisita[]
  getTaxaConversao(): number
  
  // Sessões (para cálculo de horas)
  getSessoesMes(): Sessao[]
  getTotalHorasMes(): number
  getTotalHorasCampo(): number
  getTotalHorasCredito(): number
}
```

### Fase 2: Conectar Componentes ao DataService

**Prioridade Alta:**
1. ✅ InicioTab → Usar dados reais do DataService
2. ✅ EstudosDetalhes → Receber dados via props
3. ✅ RevisitasDetalhes → Receber dados via props
4. ✅ DiaDetalhes → Receber dados via props

**Prioridade Média:**
5. ✅ PublicacoesDetalhes → Adicionar tracking de publicações
6. ✅ VideosDetalhes → Adicionar tracking de vídeos

### Fase 3: Implementar Navegações

**Para cada modal de detalhamento:**

**EstudosDetalhes.tsx:**
```typescript
interface EstudosDetalhesProps {
  onClose: () => void;
  onNavigateToEstudos: () => void;  // ✅ ADICIONAR
  onVerEstudante: (id: string) => void;  // ✅ ADICIONAR
  estudos: Estudo[];  // ✅ Receber dados reais
}
```

**RevisitasDetalhes.tsx:**
```typescript
interface RevisitasDetalhesProps {
  onClose: () => void;
  onNavigateToCampo: () => void;  // ✅ ADICIONAR
  onVerRevisita: (id: string) => void;  // ✅ ADICIONAR
  revisitas: Revisita[];  // ✅ Receber dados reais
}
```

### Fase 4: Sincronizar Checklist (DiaDetalhes)

**Problema:** Checklist no DiaDetalhes não sincroniza com EspiritualTab

**Solução:**
```typescript
// DiaDetalhes.tsx
const toggleChecklistItem = (id: string) => {
  // Atualizar localmente
  setChecklistItems(prev => ...);
  
  // Atualizar no DataService
  DataService.marcarAtividade(id, dia);
  
  // Emitir evento
  window.dispatchEvent(new CustomEvent('atividade-marcada', { detail: { id, dia } }));
};
```

---

## 📋 CHECKLIST DE INTEGRAÇÃO

### Dados
- [ ] Criar `/services/dataService.ts`
- [ ] Definir interfaces TypeScript para todas entidades
- [ ] Implementar métodos de leitura
- [ ] Implementar métodos de escrita
- [ ] Implementar cálculos de estatísticas
- [ ] Migrar dados mockados para DataService

### InicioTab
- [ ] Conectar estatísticas ao DataService
- [ ] Calcular horas reais de campo
- [ ] Calcular estudos reais
- [ ] Calcular revisitas reais
- [ ] Passar dados reais para modals

### Modals de Detalhamento
- [ ] EstudosDetalhes: receber dados via props
- [ ] RevisitasDetalhes: receber dados via props
- [ ] PublicacoesDetalhes: receber dados via props
- [ ] VideosDetalhes: receber dados via props
- [ ] DiaDetalhes: receber dados via props

### Navegações
- [ ] EstudosDetalhes → EstudosTab
- [ ] EstudosDetalhes → DetalhesEstudo
- [ ] RevisitasDetalhes → CampoTab
- [ ] RevisitasDetalhes → DetalhesRevisita
- [ ] DiaDetalhes → EstudosTab (agendar)
- [ ] DiaDetalhes → Sessão (iniciar ministério)

### Sincronização
- [ ] DiaDetalhes checklist ↔ EspiritualTab
- [ ] TemaDoMes experiências ↔ Relatório
- [ ] Estudos ↔ Revisitas (conversão)

---

## 🎨 EXEMPLO DE IMPLEMENTAÇÃO CORRETA

### Antes (Errado):
```typescript
// EstudosDetalhes.tsx
const estudantes = [
  { nome: 'João Silva', estudosMes: 3 }, // MOCKADO!
  { nome: 'Maria Santos', estudosMes: 2 } // MOCKADO!
];
```

### Depois (Correto):
```typescript
// EstudosDetalhes.tsx
interface EstudosDetalhesProps {
  estudos: Estudo[];  // Dados reais
  onClose: () => void;
  onNavigateToEstudos: () => void;
  onVerEstudante: (id: string) => void;
}

export default function EstudosDetalhes({ 
  estudos,  // Recebe dados reais
  onClose, 
  onNavigateToEstudos,
  onVerEstudante 
}: EstudosDetalhesProps) {
  // Calcular estatísticas a partir de dados reais
  const totalEstudos = estudos.length;
  const estudantesPorNome = groupBy(estudos, 'estudanteNome');
  
  return (
    // UI com dados reais
    <Button onClick={onNavigateToEstudos}>
      Ver Todos os Estudos
    </Button>
  );
}
```

---

## 🔗 MAPEAMENTO DE CONEXÕES NECESSÁRIAS

### LocalStorage → DataService
```
'estudosBiblicos' → DataService.getEstudos()
'revisitas' → DataService.getRevisitas()
'sessoes' → DataService.getSessoes()
'diarioEspiritual' → DataService.getDiario()
'alvos' → DataService.getAlvos()
'temaExperiencias' → DataService.getTemaExperiencias()
```

### InicioTab → Outras Tabs
```
Card Estudos → EstudosTab (filtro: 'todos')
Card Revisitas → CampoTab (filtro: 'novas')
Card Jornada → EspiritualTab (scroll: 'ofensiva')
Card Cronograma → (permanece no InicioTab, apenas abre modal)
```

### Modals → Tabs
```
EstudosDetalhes → EstudosTab
RevisitasDetalhes → CampoTab
DiaDetalhes → EstudosTab (agendar) | Sessão (iniciar)
TemaDoMes → PerfilTab (relatório)
```

### Sincronizações Bidirecionais
```
DiaDetalhes.checklist ↔ EspiritualTab.leituraBiblica
DiaDetalhes.estudos ↔ EstudosTab.estudos
Campo.conversao ↔ Estudos.novoEstudo
TemaDoMes.experiencias ↔ Perfil.relatorio
```

---

## ⚠️ ATENÇÃO: PROBLEMAS DE UX

### 1. Usuário marca leitura em DiaDetalhes
**Esperado:** Reflete em EspiritualTab  
**Atual:** Não sincroniza ❌

### 2. Usuário vê "11 estudos" no Dashboard
**Esperado:** Vê seus 11 estudos reais  
**Atual:** Vê dados mockados ❌

### 3. Usuário clica "Ver Todos os Estudos"
**Esperado:** Navega para EstudosTab  
**Atual:** Não faz nada ❌

### 4. Usuário converte revisita em estudo
**Esperado:** Estudo aparece na Tab Estudos  
**Atual:** Não conectado ❌

---

## 🚀 PRÓXIMOS PASSOS RECOMENDADOS

### URGENTE (Fazer AGORA):
1. ✅ Criar DataService básico
2. ✅ Conectar InicioTab ao DataService
3. ✅ Passar dados reais para modals

### IMPORTANTE (Fazer em seguida):
4. ✅ Implementar navegações dos modais
5. ✅ Sincronizar checklist entre componentes
6. ✅ Adicionar tracking de publicações/vídeos

### DESEJÁVEL (Fazer depois):
7. ✅ Implementar eventos de sincronização
8. ✅ Adicionar validações de dados
9. ✅ Melhorar performance com cache

---

## 📊 CONCLUSÃO

**Status:** ⚠️ ARQUITETURA PRECISA DE REFATORAÇÃO

**Principais Problemas:**
1. 🔴 Dados mockados desconectados dos dados reais
2. 🔴 Falta de fonte única de verdade
3. 🔴 Navegações não implementadas
4. 🔴 Sincronizações ausentes

**Recomendação:** 
Implementar DataService ANTES de adicionar novas features. A arquitetura atual criará mais confusão e bugs conforme o app crescer.

**Tempo Estimado:** 
- DataService: 2-3 horas
- Conectar componentes: 3-4 horas
- Implementar navegações: 2-3 horas
- **Total: ~8-10 horas** para ter uma arquitetura sólida

---

**Autor:** Análise Arquitetural - Mynis  
**Data:** Novembro 2025  
**Versão:** 1.0
