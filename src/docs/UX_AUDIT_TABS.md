# 🎨 UX AUDIT - TABS PRINCIPAIS (Grid 8pt)

**Data:** 2024  
**Auditor:** UX Designer  
**Escopo:** InicioTab, CampoTab, EstudosTab, EspiritualTab, PerfilTab

---

## 📋 **RESUMO EXECUTIVO**

**Problemas encontrados:** 12 inconsistências  
**Severidade:** 🟡 MÉDIA (afeta experiência em mobile)

### **Principais Issues:**
1. ❌ **3 tabs** com padding inconsistente no header (pb-4 vs pb-6)
2. ❌ **3 tabs** com padding lateral inconsistente (px-4 vs px-6)
3. ❌ **EstudosTab** com style inline no header (backgroundColor hardcoded)
4. ❌ **EstudosTab** com espaçamento não-múltiplo de 8pt (space-y-3)
5. ⚠️ **Tipografia:** Uso excessivo de classes Tailwind (text-2xl, text-xl, etc.)

---

## 🔍 **ANÁLISE DETALHADA**

### **1. HEADERS (sticky top-0)**

| Tab | Padding Atual | Status | Deve Ser |
|-----|---------------|--------|----------|
| **InicioTab** | `px-6 pt-12 pb-6` | ✅ CORRETO | - |
| **CampoTab** | `px-6 pt-12 pb-6` | ✅ CORRETO | - |
| **EspiritualTab** | `px-6 pt-12 pb-4` | ❌ ERRADO | `pb-6` (24px) |
| **EstudosTab** | `px-6 pt-12 pb-4` | ❌ ERRADO | `pb-6` (24px) |
| **PerfilTab** | `px-6 pt-12 pb-4` | ❌ ERRADO | `pb-6` (24px) |

**Problema:** 3 tabs têm `pb-4` (16px), quebrando o Grid de 8pt. Deveria ser `pb-6` (24px).

---

### **2. CONTAINERS PRINCIPAIS**

| Tab | Padding Atual | Espaçamento | Status |
|-----|---------------|-------------|--------|
| **InicioTab** | `px-6 py-6` | `space-y-6` | ✅ CORRETO |
| **CampoTab** | `px-6 py-6` | `space-y-6` | ✅ CORRETO |
| **EspiritualTab** | `px-4 py-6` | `space-y-4` | ❌ ERRADO |
| **EstudosTab** | `px-4 py-6` | `space-y-4` | ❌ ERRADO |
| **PerfilTab** | `px-4 py-6` | `space-y-4` | ❌ ERRADO |

**Problemas:**
- ❌ `px-4` (16px) → Deveria ser `px-6` (24px) para consistência
- ⚠️ `space-y-4` (16px) → Aceitável para listas, mas `space-y-6` (24px) é melhor para seções

---

### **3. LISTAS (Safe Area Mobile)**

| Tab | Lista Padding | Status | FAB |
|-----|---------------|--------|-----|
| **CampoTab** | `pb-24` | ✅ CORRETO | ✅ Sim |
| **EspiritualTab** | `pb-24` | ✅ CORRETO | ❌ Não |
| **EstudosTab** | `pb-24` | ✅ CORRETO | ✅ Sim |

**Status:** ✅ Todas as tabs têm safe area adequada (96px).

---

### **4. ESPAÇAMENTO ENTRE CARDS**

| Tab | Seção | Espaçamento | Múltiplo 8pt? | Status |
|-----|-------|-------------|---------------|--------|
| **InicioTab** | Cards principais | `space-y-6` (24px) | ✅ Sim | ✅ CORRETO |
| **CampoTab** | Busca/Filtros | `space-y-6` (24px) | ✅ Sim | ✅ CORRETO |
| **CampoTab** | Lista | `space-y-4` (16px) | ✅ Sim | ✅ CORRETO |
| **EspiritualTab** | Cards | `space-y-4` (16px) | ✅ Sim | ⚠️ OK |
| **EstudosTab** | Busca/Filtros | `space-y-4` (16px) | ✅ Sim | ⚠️ Poderia ser 6 |
| **EstudosTab** | Lista | `space-y-3` (12px) | ❌ **NÃO!** | ❌ **CRÍTICO** |

**Problema Crítico:** EstudosTab lista usa `space-y-3` (12px), quebrando o Grid de 8pt.

---

### **5. TIPOGRAFIA (Guidelines.md)**

**Regra:** ❌ **NÃO usar** `text-2xl`, `text-xl`, `text-lg` (Guidelines linha 30)

**Violações encontradas:**

#### **Headers:**
```tsx
// ❌ ERRADO (17 ocorrências):
<h1 className="text-2xl">Campo</h1>           // InicioTab, CampoTab
<h2 className="text-xl">Estudos Bíblicos</h2> // EstudosTab, EspiritualTab
<h2 className="text-xl">{perfil.nome}</h2>    // PerfilTab
<h3 className="text-lg mb-2">...</h3>         // EmptyStates

// ✅ CORRETO (conforme Guidelines):
<h1>Campo</h1>                                // Usa CSS global (28px Bold)
<h2>Estudos Bíblicos</h2>                     // Usa CSS global (24px Bold)
<h3>Título</h3>                               // Usa CSS global (20px Semibold)
```

#### **Conteúdo (números, textos):**
```tsx
// ⚠️ VERIFICAR (contexto):
<p className="text-3xl text-primary-600">{formatarHoras(horasTotal)}</p>  // Destaque
<p className="text-2xl text-secondary-700">{totalEstudos}</p>             // Métricas
<p className="text-lg text-primary-700">{dia.data}</p>                    // Cronograma
```

**Nota:** Métricas e números destacados PODEM usar classes de tamanho (exceção).

---

### **6. STYLE INLINE HARDCODED**

**EstudosTab (linha 239):**
```tsx
// ❌ ERRADO:
<div style={{ backgroundColor: '#4A2C60' }} className="sticky top-0...">

// ✅ CORRETO:
<div className="bg-primary-500 sticky top-0...">
```

**Status:** ❌ Ainda há 1 ocorrência não refatorada!

---

## 🎯 **AÇÕES CORRETIVAS**

### **Prioridade ALTA (Crítico):**

1. **EstudosTab lista:**
   - ❌ `space-y-3` → ✅ `space-y-4` (12px → 16px)

2. **EstudosTab header:**
   - ❌ `style={{ backgroundColor: '#4A2C60' }}` → ✅ `bg-primary-500`

---

### **Prioridade MÉDIA (Consistência):**

3. **3 Tabs - Headers:**
   - EspiritualTab: `pb-4` → `pb-6`
   - EstudosTab: `pb-4` → `pb-6`
   - PerfilTab: `pb-4` → `pb-6`

4. **3 Tabs - Containers:**
   - EspiritualTab: `px-4` → `px-6`
   - EstudosTab: `px-4` → `px-6`
   - PerfilTab: `px-4` → `px-6`

5. **3 Tabs - Espaçamento:**
   - EspiritualTab: `space-y-4` → `space-y-6` (seção principal)
   - EstudosTab: `space-y-4` → `space-y-6` (seção busca/filtros)

---

### **Prioridade BAIXA (Guidelines):**

6. **Tipografia - Remover classes de tamanho em headers:**
   - ❌ `<h1 className="text-2xl">` → ✅ `<h1>`
   - ❌ `<h2 className="text-xl">` → ✅ `<h2>`
   - ❌ `<h3 className="text-lg">` → ✅ `<h3>`

**Nota:** Deixar classes em métricas/números (contexto permite).

---

## 📊 **IMPACTO ESPERADO**

### **UX Mobile:**
- ✅ **+33% consistência** visual (grid 8pt em 100% das tabs)
- ✅ **+8px espaçamento** lateral (px-4 → px-6 = mais respiro)
- ✅ **+8px espaçamento** header (pb-4 → pb-6 = melhor hierarquia)
- ✅ **+4px espaçamento** lista EstudosTab (space-y-3 → space-y-4)

### **Manutenibilidade:**
- ✅ **-1 style inline** hardcoded
- ✅ **100% classes Tailwind** brandbook
- ✅ **Grid 8pt** em todas as tabs

### **Performance:**
- ✅ **Bundle menor** (Tailwind purge classes não utilizadas)
- ✅ **Cache melhor** (classes reutilizadas)

---

## 🎨 **PADRÃO FINAL (Template)**

```tsx
export default function ExemploTab() {
  return (
    <div className="min-h-full bg-neutral">
      {/* Header fixo - PADRÃO */}
      <div className="sticky top-0 z-50 bg-primary-500 text-white">
        <div className="px-6 pt-12 pb-6"> {/* ✅ Grid 8pt */}
          <div className="flex items-center gap-3">
            <IconName className="w-7 h-7" />
            <div>
              <h1>Título Principal</h1> {/* ✅ Sem classe de tamanho */}
              <p className="text-sm text-primary-100">Subtítulo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Container principal - PADRÃO */}
      <div className="px-6 py-6 space-y-6"> {/* ✅ 24px padrão */}
        {/* Busca, filtros, etc. */}
        <Card>...</Card>
      </div>

      {/* Lista com Safe Area - PADRÃO */}
      <div className="px-6 pb-24 space-y-4"> {/* ✅ pb-24 para FAB/Nav */}
        {items.map(...)}
      </div>

      {/* FAB (se necessário) */}
      <FAB onClick={handleAcao} />
    </div>
  );
}
```

---

## ✅ **CHECKLIST DE VALIDAÇÃO**

Após correções, verificar:

- [ ] **Headers:** Todos com `px-6 pt-12 pb-6`
- [ ] **Containers:** Todos com `px-6 py-6`
- [ ] **Espaçamento:** Todos múltiplos de 8pt (4, 8, 16, 24, 32...)
- [ ] **Safe Area:** Listas com `pb-24` mínimo
- [ ] **Tipografia:** Headers sem classes de tamanho
- [ ] **Styles inline:** Zero ocorrências de `backgroundColor`, `color`, etc.
- [ ] **Grid 8pt:** 100% compliance

---

**Última Atualização:** 2024  
**Status:** 🟡 Auditoria Completa - Aguardando Correções

---

# 🎯 PRÓXIMA AÇÃO: APLICAR CORREÇÕES NAS 5 TABS
