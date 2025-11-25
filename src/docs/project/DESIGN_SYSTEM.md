# 🎨 Design System - Mynis

**Sistema de design completo do aplicativo Mynis**

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Conceito: Botânica Geométrica](#conceito-botânica-geométrica)
3. [Cores](#cores)
4. [Tipografia](#tipografia)
5. [Espaçamento](#espaçamento)
6. [Componentes](#componentes)
7. [Ícones](#ícones)
8. [Acessibilidade](#acessibilidade)
9. [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral

O Design System do Mynis é baseado em **apenas 3 cores principais** que criam toda a identidade visual do aplicativo:

- 🟣 **Roxo Profundo** (#4A2C60) - Cor Primária
- 🟢 **Verde Lima** (#C8E046) - Cor Secundária
- 🟡 **Creme/Bege** (#FDF8EE) - Cor Neutra

---

## 🌱 Conceito: Botânica Geométrica

O design system é inspirado no crescimento espiritual, combinando:
- **Botânica**: Elementos orgânicos que representam crescimento
- **Geometria**: Formas limpas e estruturadas

### Princípios
1. **Crescimento** - Visual que inspira progresso
2. **Clareza** - Informação organizada e acessível
3. **Acolhimento** - Interface amigável e motivadora
4. **Consistência** - Padrões visuais claros

---

## 🎨 Cores

### Paleta Completa

#### 🟣 Roxo (Primary) - 10 Tonalidades

| Classe Tailwind | Hex | Uso Recomendado |
|-----------------|-----|-----------------|
| `bg-primary-50` | `#F5F2F7` | Fundos super claros, hover states sutis |
| `bg-primary-100` | `#E6DFF0` | Fundos de cards, áreas de destaque suave |
| `bg-primary-200` | `#D4C8E0` | Bordas suaves, separadores |
| `bg-primary-300` | `#B8A3CA` | Textos secundários, ícones inativos |
| `bg-primary-400` | `#8E68A0` | Hover de botões secundários |
| `bg-primary-500` | `#4A2C60` | **COR BASE** - Botões, headers, títulos |
| `bg-primary-600` | `#3D234D` | Hover de botões primários |
| `bg-primary-700` | `#301B3B` | Pressed states, sombras |
| `bg-primary-800` | `#231429` | Textos muito escuros, overlays |
| `bg-primary-900` | `#160D18` | Textos de alto contraste |

#### 🟢 Verde Lima (Secondary) - 10 Tonalidades

| Classe Tailwind | Hex | Uso Recomendado |
|-----------------|-----|-----------------|
| `bg-secondary-50` | `#F9FCE9` | Fundos de sucesso muito claros |
| `bg-secondary-100` | `#F1F8CF` | Cards de destaque positivo |
| `bg-secondary-200` | `#E8F4A6` | Backgrounds de badges |
| `bg-secondary-300` | `#DCEC6D` | Hover states leves |
| `bg-secondary-400` | `#D2E85A` | Acentos secundários |
| `bg-secondary-500` | `#C8E046` | **COR BASE** - Destaques, acentos |
| `bg-secondary-600` | `#A0B638` | Hover de elementos secundários |
| `bg-secondary-700` | `#7A8C2A` | Pressed states |
| `bg-secondary-800` | `#54621D` | Textos escuros sobre verde |
| `bg-secondary-900` | `#2E3810` | Contraste alto |

#### 🟡 Neutro (Creme/Bege)

| Classe Tailwind | Hex | Uso |
|-----------------|-----|-----|
| `bg-neutral-light` | `#FEFBF4` | Fundos muito claros |
| `bg-neutral` | `#FDF8EE` | **Fundo padrão alternativo** |
| `bg-neutral-dark` | `#FAF4E6` | Separadores suaves |

### Cores Semânticas

```jsx
// Sucesso (Verde)
className="bg-secondary-100 text-secondary-700 border-secondary-300"

// Informação (Roxo)
className="bg-primary-100 text-primary-700 border-primary-300"

// Atenção (Amarelo)
className="bg-yellow-50 text-yellow-700 border-yellow-300"

// Erro (Vermelho)
className="bg-red-50 text-red-700 border-red-300"
```

### Uso de Cores

#### Headers de Páginas ✅
```jsx
<header className="bg-primary-500 text-white h-14">
  <h1 className="text-white">Título</h1>
</header>
```

#### Botões Primários ✅
```jsx
<Button className="bg-primary-500 hover:opacity-90 text-white h-14">
  Ação Principal
</Button>
```

#### Botões Secundários ✅
```jsx
<Button variant="outline" className="border-primary-500 text-primary-500">
  Ação Secundária
</Button>
```

#### Badges de Status ✅
```jsx
// Ativo
<Badge className="bg-secondary-100 text-secondary-700 border-secondary-300">
  Ativo
</Badge>

// Nova
<Badge className="bg-secondary-500/20 text-secondary-700">
  Nova
</Badge>
```

---

## 📝 Tipografia

### Hierarquia de Textos

**NÃO use classes Tailwind de tamanho de fonte** (`text-2xl`, `text-lg`, etc.)  
O sistema usa tipografia padrão definida em `/styles/globals.css`

```jsx
// ✅ CORRETO - Use tags HTML semânticas
<h1>Título Principal</h1>      // Tamanho automático
<h2>Subtítulo</h2>              // Tamanho automático
<p>Texto de parágrafo</p>       // Tamanho automático

// ❌ ERRADO - Não adicione classes de tamanho
<h1 className="text-2xl">      // NÃO FAÇA ISSO
```

### Pesos de Fonte

Evite classes de peso (`font-bold`, `font-semibold`) a menos que seja explicitamente necessário.

```jsx
// ✅ CORRETO - Peso automático por tag
<h1>Título</h1>

// Apenas se necessário mudar
<p className="font-semibold">Destaque</p>
```

---

## 📏 Espaçamento

### Sistema de Grid 8px

Todos os espaçamentos seguem múltiplos de 8px:

| Nome | Pixels | Tailwind |
|------|--------|----------|
| xs | 4px | `p-1`, `gap-1` |
| sm | 8px | `p-2`, `gap-2` |
| md | 16px | `p-4`, `gap-4` |
| lg | 24px | `p-6`, `gap-6` |
| xl | 32px | `p-8`, `gap-8` |
| 2xl | 48px | `p-12`, `gap-12` |

### Padrões de Espaçamento

```jsx
// Padding interno de cards
<Card className="p-4">

// Gaps entre elementos
<div className="flex flex-col gap-4">

// Margens entre seções
<section className="mb-6">
```

---

## 🧩 Componentes

### Botões

#### Botão Primário
```jsx
<Button className="bg-primary-500 hover:opacity-90 text-white h-14 w-full">
  Salvar
</Button>
```

**Especificações:**
- Altura: `h-14` (56px)
- Cor de fundo: `bg-primary-500` (#4A2C60)
- Texto: `text-white`
- Hover: `hover:opacity-90`
- Largura: `w-full` ou específica

#### Botão Secundário (Outline)
```jsx
<Button 
  variant="outline" 
  className="border-primary-500 text-primary-500 h-14"
>
  Cancelar
</Button>
```

#### Botão Fantasma
```jsx
<Button variant="ghost" size="sm">
  <Edit className="w-4 h-4" />
</Button>
```

### Cards

```jsx
<Card className="p-4">
  <CardHeader className="flex flex-row items-center justify-between p-0 mb-3">
    <h3 className="text-primary-700">Título</h3>
  </CardHeader>
  <CardContent className="p-0">
    <p className="text-gray-600">Conteúdo</p>
  </CardContent>
</Card>
```

### Headers de Página

```jsx
<div className="sticky top-0 z-50 bg-primary-500 text-white h-14 flex items-center px-4">
  <button onClick={onBack}>
    <ArrowLeft className="w-6 h-6" />
  </button>
  <h1 className="flex-1 text-center pr-6">Título da Página</h1>
</div>
```

**Especificações:**
- Altura fixa: `h-14` (56px)
- Sticky: `sticky top-0 z-50`
- Background: `bg-primary-500`
- Padding horizontal: `px-4`

### Badges

```jsx
// Status Ativo
<Badge className="bg-secondary-100 text-secondary-700 border border-secondary-300">
  Ativo
</Badge>

// Status Nova
<Badge className="bg-secondary-500/20 text-secondary-700 border border-secondary-500/30">
  Nova
</Badge>

// Status Inativo
<Badge variant="outline" className="border-gray-300 text-gray-600">
  Inativo
</Badge>
```

### Barras de Progresso

```jsx
<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden border border-gray-300">
  <div 
    className="h-full bg-secondary-500 rounded-full transition-all"
    style={{ width: `${progresso}%` }}
  />
</div>
```

**Importante:** Sempre adicionar `border` e `overflow-hidden` para consistência visual.

### Inputs

```jsx
<Input 
  type="text"
  placeholder="Digite aqui..."
  className="h-12"
/>
```

### Select/Dropdown

```jsx
<Select>
  <SelectTrigger className="h-12">
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opcao1">Opção 1</SelectItem>
  </SelectContent>
</Select>
```

---

## 🎯 Ícones

### Padrão de Ícones

**Biblioteca:** Lucide React  
**Tamanho padrão:** `w-6 h-6` (24px)

```jsx
import { Home, User, BookOpen, Target, Settings } from 'lucide-react';

// Uso padrão
<Home className="w-6 h-6" />

// Ícones pequenos (contextuais)
<Edit className="w-4 h-4" />

// Ícones grandes (destaque)
<Target className="w-8 h-8" />
```

### Cores de Ícones

```jsx
// Header (branco)
<Home className="w-6 h-6 text-white" />

// Primário
<Home className="w-6 h-6 text-primary-500" />

// Secundário
<Home className="w-6 h-6 text-gray-600" />

// Sucesso
<CheckCircle className="w-6 h-6 text-secondary-500" />
```

---

## ♿ Acessibilidade

### Contraste de Cores (WCAG 2.1)

#### ✅ Contrastes Seguros

**Texto Escuro sobre Fundo Claro:**
- `text-primary-700` sobre `bg-white` → AAA
- `text-primary-600` sobre `bg-primary-50` → AA
- `text-secondary-700` sobre `bg-secondary-50` → AAA

**Texto Claro sobre Fundo Escuro:**
- `text-white` sobre `bg-primary-500` → AAA
- `text-primary-50` sobre `bg-primary-700` → AA

#### ❌ Evitar

- `text-secondary-500` sobre `bg-white` → Falha contraste
- `text-primary-300` sobre `bg-primary-50` → Falha contraste

### Navegação por Teclado

```jsx
// Botões acessíveis
<button 
  aria-label="Voltar"
  className="focus:ring-2 focus:ring-primary-500 focus:outline-none"
>
  <ArrowLeft className="w-6 h-6" />
</button>

// Inputs com labels
<Label htmlFor="nome">Nome *</Label>
<Input id="nome" required aria-required="true" />
```

### Textos Alternativos

```jsx
// Ícones decorativos (não precisam de alt)
<Home className="w-6 h-6" aria-hidden="true" />

// Botões de ação (precisam de aria-label)
<button aria-label="Editar revisita">
  <Edit className="w-4 h-4" />
</button>
```

---

## ✅ Boas Práticas

### DO ✓ (Faça)

1. **Use as cores do brandbook**
```jsx
✓ <Button className="bg-primary-500">
```

2. **Mantenha alturas consistentes**
```jsx
✓ <Button className="h-14">
✓ <Input className="h-12">
```

3. **Use espaçamentos múltiplos de 8px**
```jsx
✓ <div className="p-4 gap-4 mb-6">
```

4. **Ícones do Lucide React**
```jsx
✓ import { Home } from 'lucide-react';
✓ <Home className="w-6 h-6" />
```

5. **Headers sticky padronizados**
```jsx
✓ <div className="sticky top-0 z-50 bg-primary-500 h-14">
```

### DON'T ✗ (Evite)

1. **❌ NÃO use outras cores além do brandbook**
```jsx
✗ <Button className="bg-green-600">
✗ <Button className="bg-blue-500">
```

2. **❌ NÃO adicione classes de tamanho de fonte**
```jsx
✗ <h1 className="text-2xl">
✗ <p className="text-lg font-bold">
```

3. **❌ NÃO use emojis (use ícones vetoriais)**
```jsx
✗ <span>🏠 Início</span>
✓ <Home className="w-6 h-6" />
```

4. **❌ NÃO crie alturas customizadas de botão**
```jsx
✗ <Button className="h-10">
✗ <Button className="py-3">
✓ <Button className="h-14">  // Padrão 56px
```

5. **❌ NÃO esqueça bordas nas barras de progresso**
```jsx
✗ <div className="bg-gray-200 rounded-full h-2">
✓ <div className="bg-gray-200 rounded-full h-2 border border-gray-300">
```

---

## 🎨 Templates Prontos

### Página Completa com Header

```jsx
export default function MinhaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Sticky */}
      <div className="sticky top-0 z-50 bg-primary-500 text-white h-14 flex items-center px-4">
        <button onClick={handleVoltar}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center pr-6">Título da Página</h1>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-4">
        <Card className="p-4">
          <h2 className="text-primary-700 mb-3">Seção</h2>
          <p className="text-gray-600">Conteúdo</p>
        </Card>
      </div>

      {/* Botão de Ação */}
      <div className="p-4 bg-white border-t">
        <Button className="bg-primary-500 hover:opacity-90 text-white h-14 w-full">
          Salvar
        </Button>
      </div>
    </div>
  );
}
```

### Card com Ações

```jsx
<Card className="p-4">
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="bg-primary-100 p-2 rounded-lg">
        <User className="w-6 h-6 text-primary-500" />
      </div>
      <div>
        <h3 className="text-primary-700">Nome</h3>
        <p className="text-sm text-gray-600">Descrição</p>
      </div>
    </div>
    <Badge className="bg-secondary-100 text-secondary-700 border border-secondary-300">
      Ativo
    </Badge>
  </div>
  
  <div className="flex gap-2">
    <Button 
      variant="outline" 
      size="sm" 
      className="flex-1 border-primary-500 text-primary-500"
    >
      <Eye className="w-4 h-4 mr-2" />
      Ver
    </Button>
    <Button 
      variant="ghost" 
      size="sm"
    >
      <Edit className="w-4 h-4" />
    </Button>
  </div>
</Card>
```

---

## 📚 Referências

**Arquivos Principais:**
- `/styles/globals.css` - Estilos globais e tipografia
- `/styles/design-tokens.css` - Tokens de design
- `/components/ui/` - Componentes ShadCN UI

**Documentação Relacionada:**
- [Brandbook Completo](./BRANDBOOK.md)
- [Guidelines de Desenvolvimento](../development/GUIDELINES.md)

---

**Versão:** 2.0  
**Última Atualização:** 2024  
**Mantido por:** Equipe Mynis Design System
