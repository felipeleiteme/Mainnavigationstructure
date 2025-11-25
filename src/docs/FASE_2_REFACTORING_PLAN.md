# 🔧 Fase 2: Plano de Refatoração - Mynis

**Status:** 🟡 Em Progresso  
**Data Início:** 2024  
**Prioridade:** ALTA  

---

## 📊 Resumo da Análise

### **Cores Hardcoded Encontradas:**

| Cor Hex | Instâncias | Arquivos Afetados | Substituir Por |
|---------|-----------|------------------|----------------|
| `#4A2C60` (Roxo) | **106** | 14 arquivos | `bg-primary-500` ou `.bg-primary` |
| `#C8E046` (Verde) | **39** | 14 arquivos | `bg-secondary-500` ou `.bg-secondary` |
| **TOTAL** | **145** | **14 arquivos únicos** | Classes semânticas |

---

## 🎯 Estratégia de Refatoração

### **Prioridade 1: Componentes Core (6 arquivos)**
Componentes mais usados, maior impacto visual:

1. ✅ **`/App.tsx`** (1 instância)
   - Bottom navigation

2. ✅ **`/components/estudos/FormularioEstudo.tsx`** (26 instâncias)
   - Formulário principal de estudos
   - Headers, ícones, status cards

3. ✅ **`/components/tabs/CampoTab.tsx`** (2 instâncias)
   - Tab de revisitas
   - Ícones de interesse

4. ✅ **`/components/tabs/PerfilTab.tsx`** (1 instância)
   - Botão de desenvolvimento

5. ✅ **`/components/shared/FAB.tsx`** (1 instância)
   - Floating Action Button principal

6. ✅ **`/components/ui/progress.tsx`** (1 instância)
   - Barra de progresso global

---

### **Prioridade 2: Páginas de Detalhes (8 arquivos)**
Telas secundárias mas importantes:

7. ⏳ **`/components/pages/DetalhesRevisitaPage.tsx`** (5 instâncias)
8. ⏳ **`/components/pages/EstatisticasPage.tsx`** (13 instâncias)
9. ⏳ **`/components/pages/ProgressoPage.tsx`** (9 instâncias)
10. ⏳ **`/components/pages/CronogramaPage.tsx`** (6 instâncias)
11. ⏳ **`/components/pages/ConfiguracoesLeituraPage.tsx`** (3 instâncias)
12. ⏳ **`/components/pages/LeituraBibliaPage.tsx`** (2 instâncias)
13. ⏳ **`/components/pages/EnviarRelatorioPage.tsx`** (1 instância)
14. ⏳ **`/components/cronograma/DiaDetalhes.tsx`** (15 instâncias)

---

### **Prioridade 3: Estatísticas & Detalhes (4 arquivos)**

15. ⏳ **`/components/estatisticas/EstudosDetalhes.tsx`** (21 instâncias)
16. ⏳ **`/components/estatisticas/RevisitasDetalhes.tsx`** (14 instâncias)
17. ⏳ **`/components/estatisticas/PublicacoesDetalhes.tsx`** (7 instâncias)
18. ⏳ **`/components/estatisticas/VideosDetalhes.tsx`** (3 instâncias)

---

### **Prioridade 4: Componentes Auxiliares (7 arquivos)**

19. ⏳ **`/components/inicio/DashboardEmptyState.tsx`** (4 instâncias)
20. ⏳ **`/components/inicio/ProximasAcoes.tsx`** (2 instâncias)
21. ⏳ **`/components/leitura/EmptyStateLeitura.tsx`** (2 instâncias)
22. ⏳ **`/components/leitura/MarcarLeituraDialog.tsx`** (2 instâncias)
23. ⏳ **`/components/leitura/OnboardingLeitura.tsx`** (1 instância)
24. ⏳ **`/components/onboarding/OnboardingFlow.tsx`** (8 instâncias)
25. ⏳ **`/components/notifications/NotificationDemo.tsx`** (1 instância)
26. ⏳ **`/components/shared/HorizontalFilterList.tsx`** (1 instância)

---

## 🔄 Padrões de Substituição

### **1. Backgrounds (Mais Comum)**

```jsx
// ❌ ANTES
style={{ backgroundColor: '#4A2C60' }}
style={{ backgroundColor: '#C8E046' }}

// ✅ DEPOIS
className="bg-primary-500"
className="bg-secondary-500"
```

---

### **2. Cores de Ícones**

```jsx
// ❌ ANTES
<Icon style={{ color: '#4A2C60' }} />
<Icon style={{ color: '#C8E046' }} />

// ✅ DEPOIS
<Icon className="text-primary-500" />
<Icon className="text-secondary-500" />
```

---

### **3. Bordas**

```jsx
// ❌ ANTES
style={{ borderColor: '#4A2C60' }}
style={{ borderColor: '#C8E046' }}

// ✅ DEPOIS
className="border-primary-500"
className="border-secondary-500"
```

---

### **4. Gradientes e Backgrounds Complexos**

```jsx
// ❌ ANTES
style={{ 
  backgroundColor: 'rgba(74, 44, 96, 0.05)',
  borderColor: '#4A2C60' 
}}

// ✅ DEPOIS
className="bg-primary-50 border-primary-500"
```

---

### **5. Casos Especiais - Inline Styles Necessários**

Alguns casos ainda precisam de inline styles por limitação do Tailwind:

```jsx
// ⚠️ PERMITIDO (opacidade custom)
style={{ backgroundColor: 'rgba(74, 44, 96, 0.03)' }}

// ✅ MELHOR (usar classe Tailwind)
className="bg-primary-500/[0.03]"
```

---

## 📋 Checklist de Refatoração por Arquivo

### **1. /App.tsx** ✅ COMPLETO
- [x] Linha 195: Bottom nav color → `text-primary-500`

### **2. /components/estudos/FormularioEstudo.tsx** ✅ COMPLETO
- [x] Linha 172: Header background → `bg-primary-500`
- [x] Linhas 201-467: Ícones color → `text-primary-500`
- [x] Linhas 273-498: Borders & backgrounds → classes Tailwind

### **3. /components/tabs/CampoTab.tsx** ✅ COMPLETO
- [x] Linha 435: Ícone star → `text-secondary-500`

### **4. /components/tabs/PerfilTab.tsx** ✅ COMPLETO
- [x] Linha 326: Botão border → `border-secondary-500`

### **5. /components/shared/FAB.tsx** ✅ COMPLETO
- [x] Linha 83: Background verde → usar variável CSS

### **6. /components/ui/progress.tsx** ✅ COMPLETO
- [x] Linha 28: Progress bar → `bg-secondary-500`

---

### **7. /components/pages/DetalhesRevisitaPage.tsx** ⏳ PRÓXIMO
- [ ] Linhas 185-469: 5 instâncias
  - Badge backgrounds
  - Icon colors
  - Border colors

### **8. /components/pages/EstatisticasPage.tsx** ⏳ PRÓXIMO
- [ ] Linhas 32-1102: 13 instâncias
  - Const CORES_ATIVIDADES
  - Progress bars
  - Cards borders
  - Badge colors

---

## 🎨 Novas Classes Disponíveis

Após Fase 1, agora temos:

```css
/* Backgrounds */
.bg-primary       /* #4A2C60 */
.bg-secondary     /* #C8E046 */

/* Textos */
.text-primary     /* #4A2C60 */
.text-secondary   /* #C8E046 */

/* Bordas */
.border-primary   /* #4A2C60 */
.border-secondary /* #C8E046 */

/* Hover states */
.hover:bg-primary:hover  /* #3D234D */
.hover:bg-secondary:hover /* #A0B638 */
```

---

## 📊 Progresso

| Categoria | Total | Completo | Pendente | % |
|-----------|-------|----------|----------|---|
| **Prioridade 1** | 32 | 32 | 0 | 100% |
| **Prioridade 2** | 54 | 0 | 54 | 0% |
| **Prioridade 3** | 45 | 0 | 45 | 0% |
| **Prioridade 4** | 19 | 0 | 19 | 0% |
| **TOTAL** | **150** | **32** | **118** | **21%** |

---

## 🚀 Próximos Passos

1. **Refatorar Prioridade 1** ✅ COMPLETO (32/32)
2. **Refatorar Prioridade 2** ⏳ EM ANDAMENTO (0/54)
3. **Testar Visualmente** (após cada prioridade)
4. **Refatorar Prioridade 3** (0/45)
5. **Refatorar Prioridade 4** (0/19)
6. **Validação Final & QA**

---

## ⚠️ Atenções Especiais

### **Casos que NÃO devem ser alterados:**

1. **Gradientes complexos** - Podem precisar inline para opacidades customizadas
2. **Animações dinâmicas** - Onde a cor é calculada via JS
3. **ShadCN UI components** - Já usam variáveis CSS corretas

### **Teste Obrigatório Após Refatoração:**

- [ ] Navegação bottom tab (cores ativas)
- [ ] Formulários (validação, focus states)
- [ ] Cards de status (badges, ícones)
- [ ] Progress bars (todas as instâncias)
- [ ] FAB (estados ativo/pausado)
- [ ] Headers (todos os roxos)
- [ ] Hover states (todos os botões)

---

## 📝 Notas de Implementação

**Ordem de execução:**
1. Substituir hex por classes Tailwind
2. Testar visualmente cada componente
3. Commitar mudanças por arquivo
4. Validar responsividade
5. Próximo arquivo

**Commits sugeridos:**
```bash
git commit -m "refactor(ui): replace #4A2C60 with bg-primary-500 in FormularioEstudo"
git commit -m "refactor(ui): replace #C8E046 with bg-secondary-500 in CampoTab"
```

---

**Última Atualização:** 2024  
**Responsável:** Time Frontend  
**Status:** 🟡 21% Completo (32/150)
