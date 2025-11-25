# 🤖 Guia IA - Desenvolvimento Mynis

# 📋 Visão Geral do Projeto

**Mynis** (My Ministry) é um aplicativo para organização do ministério de Testemunhas de Jeová, com foco em:

- Gerenciamento de estudos bíblicos
- Acompanhamento de revisitas
- Diário espiritual
- Estatísticas de campo
- Privacidade total (dados 100% locais)

---

# 🎨 Design System

## Cores Oficiais (Brandbook)

- **Primária:** `#4A2C60` (roxo profundo) - Headers, navegação, botões principais
- **Secundária:** `#C8E046` (verde lima) - FABs, ações, destaques
- **Neutra:** `#FDF8EE` (creme) - Fundo da aplicação
- **Erro:** `#F44336` (vermelho)

## Conceito Visual

**"Botânica Geométrica"** - Crescimento espiritual como cultivo de relacionamentos:

- 🌱 Verde = Crescimento, novo, vida
- 🔥 Laranja = Urgência, prioridade
- 💜 Roxo = Espiritualidade, profundidade

## Tipografia

**Fonte Única:** Inter

- **H1:** Inter Bold (28px)
- **H2:** Inter Bold (24px)
- **H3:** Inter Semibold (20px)
- **Corpo:** Inter Regular (16px mínimo mobile)
- **Body Small:** Inter Regular (14px)
- **Caption:** Inter Regular (12px)

## Espaçamentos (Grid 8pt)

- xxs: 4px
- xs: 8px
- sm: 16px (padrão)
- md: 24px
- lg: 32px
- xl: 48px
- xxl: 64px

## Ícones

- **Padrão:** 24px (w-6 h-6)
- **Inline:** 16px (w-4 h-4)
- **FABs:** 32px (w-8 h-8)
- **Empty states:** 48px (w-12 h-12)

**Biblioteca:** lucide-react (vetoriais, não emojis)

---

# 🏗️ Arquitetura

## DataService (Fonte Única de Verdade)

**Localização:** `/services/dataService.ts`

### Responsabilidades

- Gerenciar CRUD de todas entidades
- Sincronizar com localStorage
- Emitir eventos de mudança (`mynis-data-change`)
- Calcular estatísticas e agregações

### Padrão de Uso

```tsx
// Em qualquer componente
const carregar = () => {
  const dados = DataService.getDados();
  setDados(dados);
};

useEffect(() => {
  carregar();
  DataService.on('mynis-data-change', carregar);
  return () => DataService.off('mynis-data-change', carregar);
}, []);
```

### Principais Métodos

**Estudos:**

- `getEstudos()`: Estudo[]
- `adicionarEstudo(estudo)`: void
- `atualizarEstudo(id, estudo)`: void
- `removerEstudo(id)`: void
- `getTotalEstudosMes()`: number

**Revisitas:**

- `getRevisitas()`: Revisita[]
- `adicionarRevisita(revisita)`: void
- `atualizarRevisita(id, revisita)`: void
- `removerRevisita(id)`: void
- `getRevisitasNovasMes()`: Revisita[]

**Sincronização:**

- Todas as operações de escrita disparam `window.dispatchEvent(new Event('mynis-data-change'))`
- Todos componentes escutam e recarregam automaticamente

---

# 📦 Estrutura de Dados

## Estudo

```tsx
interface Estudo {
  id: string;
  estudanteNome: string;
  telefone?: string;
  endereco?: string;
  publicacao: string;
  licao: number; // 1-10
  data: string; // ISO date
  horario: string; // HH:mm
  progresso: number; // calculado
  status: 'ativo' | 'pausado' | 'concluido';
}
```

## Revisita

```tsx
interface Revisita {
  id: string;
  nome: string;
  telefone?: string;
  endereco: string;
  origem: 'casa-em-casa' | 'testemunho' | 'comercio' | 'outros';
  primeiraConversa: string;
  publicacoesEntregues: string[];
  status: 'nova' | 'quente' | 'comercio' | 'descanso';
  interesseEstudo: boolean;
  ultimaVisita?: string; // ISO date
  quantidadeVisitas: number;
}
```

---

# 🎯 Componentes Principais

## FormularioEstudo.tsx

**Props:**

```tsx
interface FormularioEstudoProps {
  estudo?: Estudo; // Para edição
  revisitaConversao?: { nome, telefone, endereco }; // Para conversão
  onClose: () => void;
  onSave?: () => void;
}
```

**Recursos:**

- 3 modos: Criar / Editar / Converter
- Validação de campos obrigatórios
- Cálculo automático de progresso
- Toast notifications

**Design:**

- Header roxo `#4A2C60`
- Ícone BookOpen
- Sticky header e footer

## FormularioRevisita.tsx

**Props:**

```tsx
interface FormularioRevisitaProps {
  revisita?: Revisita; // Para edição
  onClose: () => void;
  onSave?: () => void;
}
```

**Recursos:**

- 5 seções: Básicas / Origem / Conversa / Publicações / Status
- Seleção visual de origem (4 botões com ícones)
- Lista dinâmica de publicações
- Checkbox "Interesse em estudar"

**Design:**

- Header verde lima `#C8E046`
- Ícone Sprout
- Grid 2x2 para origens

---

# 🔄 Fluxos Implementados

## 1. Criar Nova Revisita

1. CampoTab → Botão FAB "+"
2. FormularioRevisita abre
3. Preencher e validar
4. `DataService.adicionarRevisita()`
5. Evento disparado
6. CampoTab recarrega automaticamente
7. Toast: "Revisita adicionada com sucesso! 🌱"

## 2. Converter Revisita → Estudo

1. CampoTab → Card com badge "⭐ Interesse"
2. Botão "Iniciar Estudo"
3. FormularioEstudo abre com dados preenchidos
4. Completar informações
5. `DataService.adicionarEstudo()`
6. Toast: "🎉 Revisita convertida em estudo!"
7. Navega para EstudosTab
8. Revisita permanece na lista

## 3. Editar Estudo/Revisita

1. Tab → Card → "Ver Detalhes"
2. Formulário abre com dados
3. Modificar e salvar
4. `DataService.atualizar___()`
5. Evento disparado
6. UI atualiza automaticamente

---

# 🎨 Padrões de UI

## Headers de Tabs

```tsx
<div 
  style= backgroundColor: '#4A2C60'  
  className="sticky top-0 z-50 text-white"
>
  <div className="px-6 py-4">
    <div className="flex items-center gap-3">
      <IconName className="w-7 h-7" />
      <div>
        <h1 className="text-xl">Título</h1>
        <p className="text-xs opacity-90">Subtítulo</p>
      </div>
    </div>
  </div>
</div>
```

## FAB (Floating Action Button)

**Classes principais:**

- `fixed bottom-20 right-4` - Posicionamento
- `rounded-full h-14 px-6` - Formato arredondado
- `shadow-lg z-40 border-0` - Elevação e z-index
- `transition-all duration-300 hover:scale-110` - Animação

**Cores:**

- Background: `#C8E046` (verde lima)
- Texto: `#1F2937` (escuro)
- Hover: `#B5CC3D` (verde lima escurecido)

## Badges de Status

**Padrão:** `-50` (fundo) + `-600` (texto) + `-100` (borda)

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'nova': 
      return 'bg-green-50 text-green-600 border-green-100';
    case 'quente': 
      return 'bg-orange-50 text-orange-600 border-orange-100';
    // ...
  }
};
```

## Cards

```tsx
<Card className="p-4 hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] bg-white border-0 shadow-sm">
  {/* Conteúdo */}
</Card>
```

## Páginas Internas (Full Screen)

**Padrão oficial** para páginas como EditarInformacoesPage, RegistrarVisitaPage, NovaRevisitaPage, etc.

### Container Principal

```tsx
<div className="fixed inset-0 z-50 overflow-y-auto pb-20" style={{ backgroundColor: '#FDF8EE' }}>
  {/* Conteúdo */}
</div>
```

**Classes obrigatórias:**
- `fixed inset-0` - Ocupa toda a tela
- `z-50` - Fica acima de outros elementos
- `overflow-y-auto` - Permite scroll vertical
- `pb-20` - Espaço para navegação inferior

### Header Padrão

```tsx
<div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
  <div className="flex items-center gap-4 px-6 pt-12 pb-4">
    <Button
      variant="ghost"
      size="sm"
      onClick={onVoltar}
      className="p-2 text-white hover:bg-white/20"
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
    <div className="flex-1">
      <h2 className="text-xl">Título da Página</h2>
      <p className="text-sm opacity-90">Subtítulo descritivo</p>
    </div>
  </div>
</div>
```

**Elementos obrigatórios:**
- Botão voltar com ícone `<ArrowLeft />`
- Título descritivo (h2)
- Subtítulo contextual (p com opacity-90)
- Fundo roxo `#4A2C60`
- `sticky top-0 z-10` para fixar no topo

### Cards de Conteúdo

**SEMPRE** usar Cards brancos para agrupar campos:

```tsx
<div className="px-6 py-6 space-y-6">
  {/* Card 1: Seção Principal */}
  <Card className="p-6">
    <Label className="mb-3 block text-gray-700">Título da Seção</Label>
    {/* Campos */}
  </Card>

  {/* Card 2: Detalhes */}
  <Card className="p-6">
    <div className="space-y-5">
      {/* Campos de formulário */}
    </div>
  </Card>

  {/* Botão de Ação Principal */}
  <Button 
    className="w-full h-14 text-white hover:opacity-90 border-0"
    style={{ backgroundColor: '#4A2C60' }}
    onClick={handleSalvar}
  >
    Texto do Botão
  </Button>
</div>
```

**Padrão de Cards:**
- `<Card className="p-6">` - Padding de 24px (grid 8pt)
- Fundo branco automático
- Agrupa campos relacionados logicamente
- `space-y-5` (20px) entre campos dentro do card
- `space-y-6` (24px) entre cards

### Inputs Padronizados

**Todos os inputs** devem seguir este padrão:

```tsx
<Input
  className="h-14 border-2 bg-white focus:ring-2 focus:ring-opacity-50"
  style={{ borderColor: '#D8CEE8', outline: 'none' }}
  onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
  onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
/>
```

**Para Textarea:**

```tsx
<Textarea
  className="resize-none border-2 bg-white focus:ring-2 focus:ring-opacity-50"
  style={{ borderColor: '#D8CEE8', outline: 'none' }}
  onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
  onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
  rows={6}
/>
```

**Características obrigatórias:**
- Altura `h-14` (56px) para inputs
- Fundo branco `bg-white`
- Borda `border-2` com cor `#D8CEE8`
- Focus muda borda para roxo `#4A2C60`
- Blur volta borda para cinza `#D8CEE8`
- `outline: none` remove outline padrão

### Labels Padronizadas

```tsx
<Label htmlFor="campo" className="flex items-center gap-2 mb-2 text-gray-700">
  <IconName className="w-4 h-4" style={{ color: '#4A2C60' }} />
  Nome do Campo
</Label>
```

**Características:**
- Ícone do lucide-react (w-4 h-4)
- Cor do ícone: roxo `#4A2C60`
- Texto: `text-gray-700`
- Gap de 2 (8px) entre ícone e texto

### Botão Principal

```tsx
<Button 
  className="w-full h-14 text-white hover:opacity-90 border-0"
  style={{ backgroundColor: '#4A2C60' }}
  onClick={handleAcao}
>
  Texto da Ação
</Button>
```

**Características obrigatórias:**
- Altura `h-14` (56px) - padrão brandbook
- Largura completa `w-full`
- Fundo roxo `#4A2C60`
- Texto branco
- `hover:opacity-90` para feedback
- `border-0` remove borda padrão

### Scroll Comportamento

**SEMPRE** adicionar no useEffect:

```tsx
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'instant' });
}, []);
```

Garante que a página sempre abre no topo.

### Exemplo Completo: RegistrarVisitaPage

```tsx
export default function RegistrarVisitaPage({ revisitaId, onVoltar }: Props) {
  // Scroll para o topo
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto pb-20" style={{ backgroundColor: '#FDF8EE' }}>
      {/* Header fixo */}
      <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
        <div className="flex items-center gap-4 px-6 pt-12 pb-4">
          <Button variant="ghost" size="sm" onClick={onVoltar} className="p-2 text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl">Registrar Visita</h2>
            <p className="text-sm opacity-90">Como foi a conversa?</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card 1 */}
        <Card className="p-6">
          <Label className="mb-3 block text-gray-700">Seção Principal</Label>
          {/* Conteúdo */}
        </Card>

        {/* Card 2 */}
        <Card className="p-6">
          <div className="space-y-5">
            <div>
              <Label htmlFor="campo" className="flex items-center gap-2 mb-2 text-gray-700">
                <FileText className="w-4 h-4" style={{ color: '#4A2C60' }} />
                Nome do Campo
              </Label>
              <Input
                id="campo"
                className="h-14 border-2 bg-white focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
              />
            </div>
          </div>
        </Card>

        {/* Botão de Ação */}
        <Button 
          className="w-full h-14 text-white hover:opacity-90 border-0"
          style={{ backgroundColor: '#4A2C60' }}
          onClick={handleSalvar}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
```

### ✅ Checklist de Padrão

- [ ] Container: `fixed inset-0 z-50 overflow-y-auto pb-20`
- [ ] Fundo: `backgroundColor: '#FDF8EE'`
- [ ] Header: `sticky top-0 z-10` com roxo `#4A2C60`
- [ ] Botão voltar: `<ArrowLeft />` com `hover:bg-white/20`
- [ ] Conteúdo: `px-6 py-6 space-y-6`
- [ ] Cards brancos: `<Card className="p-6">`
- [ ] Inputs: `h-14 border-2 bg-white` com focus roxo
- [ ] Labels: `text-gray-700` com ícone roxo
- [ ] Botão principal: `h-14` roxo com `hover:opacity-90`
- [ ] Scroll: `window.scrollTo({ top: 0, behavior: 'instant' })`

### ❌ Erros Comuns

**NÃO fazer:**
- ❌ Inputs sem fundo branco
- ❌ Botões fixos no rodapé (conflitam com menu)
- ❌ Campos soltos sem Cards
- ❌ Botões com altura diferente de h-14
- ❌ Header sem z-10
- ❌ Container sem pb-20

**SEMPRE fazer:**
- ✅ Inputs com `bg-white` e bordas `#D8CEE8`
- ✅ Botão de ação no fluxo normal (não fixo)
- ✅ Agrupar campos em Cards brancos
- ✅ Botão principal com `h-14` (56px)
- ✅ Header com `z-10` e roxo
- ✅ Container com `pb-20` para espaço do menu

---

# ✅ Validações

## FormularioEstudo

- Nome obrigatório
- Publicação obrigatória
- Data obrigatória
- Horário obrigatório
- Campos em vermelho quando erro
- Toast de erro

## FormularioRevisita

- Nome obrigatório
- Endereço obrigatório
- Primeira conversa obrigatória
- Origem obrigatória
- Campos em vermelho quando erro
- Toast de erro

---

# 💬 Toast Notifications

```tsx
// Sucesso
toast.success('Item adicionado com sucesso! 🎉');
toast.success('Item atualizado com sucesso!');

// Conversão especial
toast.success('🎉 Revisita convertida em estudo! Parabéns!');

// Erro
toast.error('Por favor, preencha todos os campos obrigatórios');
```

---

# 🚫 O Que NÃO Fazer

## ❌ Cores

- **Nunca** usar `bg-green-600`, `bg-blue-600` para elementos principais
- **Sempre** usar `#4A2C60` (roxo) ou `#C8E046` (verde lima)
- Evitar cores que violam o brandbook

## ❌ Emojis

- **Nunca** usar emojis para ícones funcionais
- **Sempre** usar ícones vetoriais do lucide-react
- Exemplo: ✅ `<Star className="w-3 h-3" />` ❌ `⭐`

## ❌ Dados Mockados

- **Nunca** criar dados mockados hardcoded
- **Sempre** usar DataService como fonte única

## ❌ Espaçamentos

- **Nunca** usar `p-3` (12px), `py-5` (20px)
- **Sempre** usar múltiplos de 8px: `p-sm` (16px), `p-md` (24px)

## ❌ Z-index

- **Nunca** usar `z-10` para headers/navigation
- **Sempre** usar `z-50` para headers, `z-40` para FABs

---

# 🔐 Princípios de Privacidade

## Dados 100% Locais

- Todos os dados são armazenados **apenas no localStorage do navegador**
- Nenhum dado é enviado para servidores externos
- Usuário tem controle total sobre seus dados
- Sem monetização de dados
- Sem rastreamento ou analytics

## Importante

- O Mynis **não é adequado** para coleta de dados sensíveis de outras pessoas
- É um caderno pessoal digital, não uma ferramenta de compartilhamento

---

# 🎯 Regras de Ouro

## 1. Fonte Única de Verdade

✅ **SIM:** `DataService.getEstudos()`

❌ **NÃO:** `const estudos = [...]` hardcoded

## 2. Sincronização Automática

✅ **SIM:** Escutar evento `mynis-data-change`

❌ **NÃO:** Recarregar manualmente

## 3. Componentes React

✅ **SIM:** `<GreetingIcon className="w-5 h-5" />`

❌ **NÃO:** `{greetingIcon}` (variável string)

## 4. Última Tela de Fluxo

✅ **SIM:** `onClick={handleComplete}`

❌ **NÃO:** `onClick={nextStep}` (pode causar tela branca)

## 5. Validações

✅ **SIM:** Validar no frontend com feedback visual

❌ **NÃO:** Permitir salvar dados inválidos

---

# 📊 Estado Atual do Projeto

## ✅ 100% Completo

- DataService implementado e funcionando
- Sincronização bidirecional
- FormularioEstudo e FormularioRevisita
- CampoTab e EstudosTab conectados
- Navegações implementadas
- Validações robustas
- Toast notifications
- Design system alinhado ao brandbook

## 🎯 Próximas Features Sugeridas

1. Sistema de Relatório Mensal
2. Sistema de Metas
3. Sistema de Histórico
4. Push Notifications
5. Visualização em Mapa
6. Export/Import de dados
7. Sincronização na nuvem

---

# 🔧 Comandos Úteis

## Criar Novo Componente

```bash
# Sempre seguir estrutura:
# 1. Imports (React, lucide-react, shadcn/ui)
# 2. Interfaces TypeScript
# 3. Componente funcional
# 4. useEffect para DataService
# 5. Handlers de eventos
# 6. JSX com classes do design system
```

## Testar Sincronização

```tsx
// Console do navegador
DataService.adicionarEstudo({ ... });
// Verificar se todos os componentes atualizaram
```

---

**Última atualização:** Novembro 2025

**Versão:** 4.0 - Lançamento Completo

**Status:** ✅ Pronto para Produção