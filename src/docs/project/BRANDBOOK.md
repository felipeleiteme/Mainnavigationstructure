# 🎨 Brandbook Oficial - Mynis

**Guia de identidade visual e aplicação de cores do Mynis**

---

## 📋 Índice
- [Cores Principais](#cores-principais)
- [Sistema de Variações](#sistema-de-variações)
- [Como Usar](#como-usar)
- [Exemplos Práticos](#exemplos-práticos)
- [Boas Práticas](#boas-práticas)
- [Acessibilidade](#acessibilidade)

---

## 🎯 Cores Principais

### **1. Roxo Profundo (Primary) - Cor Principal**
**Base:** `#4A2C60` (500)

**Uso:** Headers, botões primários, títulos importantes, elementos de navegação

### **2. Verde Lima (Secondary) - Cor Secundária**
**Base:** `#C8E046` (500)

**Uso:** Destaques, acentos visuais, badges de sucesso, elementos de feedback positivo

### **3. Creme/Bege (Neutral) - Cor Neutra**
**Base:** `#FDF8EE`

**Uso:** Fundos alternativos, cards especiais, seções destacadas

---

## 🌈 Sistema de Variações

### **Roxo (Primary) - 10 Tonalidades**

| Nível | Hex | RGB | Uso Recomendado |
|-------|-----|-----|----------------|
| **50** | `#F5F2F7` | `245, 242, 247` | Fundos super claros, hover states sutis |
| **100** | `#E6DFF0` | `230, 223, 240` | Fundos de cards, áreas de destaque suave |
| **200** | `#D4C8E0` | `212, 200, 224` | Bordas suaves, separadores |
| **300** | `#B8A3CA` | `184, 163, 202` | Textos secundários, ícones inativos |
| **400** | `#8E68A0` | `142, 104, 160` | Hover de botões secundários |
| **500** | `#4A2C60` | `74, 44, 96` | **COR BASE - Botões, headers, títulos** |
| **600** | `#3D234D` | `61, 35, 77` | Hover de botões primários |
| **700** | `#301B3B` | `48, 27, 59` | Pressed states, sombras |
| **800** | `#231429` | `35, 20, 41` | Textos muito escuros, overlays |
| **900** | `#160D18` | `22, 13, 24` | Textos de alto contraste |

---

### **Verde Lima (Secondary) - 10 Tonalidades**

| Nível | Hex | RGB | Uso Recomendado |
|-------|-----|-----|----------------|
| **50** | `#F9FCE9` | `249, 252, 233` | Fundos de sucesso muito claros |
| **100** | `#F1F8CF` | `241, 248, 207` | Cards de destaque positivo |
| **200** | `#E8F4A6` | `232, 244, 166` | Backgrounds de badges |
| **300** | `#DCEC6D` | `220, 236, 109` | Hover states leves |
| **400** | `#D2E85A` | `210, 232, 90` | Acentos secundários |
| **500** | `#C8E046` | `200, 224, 70` | **COR BASE - Destaques, acentos** |
| **600** | `#A0B638` | `160, 182, 56` | Hover de elementos secundários |
| **700** | `#7A8C2A` | `122, 140, 42` | Pressed states |
| **800** | `#54621D` | `84, 98, 29` | Textos escuros sobre verde |
| **900** | `#2E3810` | `46, 56, 16` | Contraste alto |

---

### **Neutro (Creme/Bege) - 3 Variações**

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Light** | `#FEFBF4` | `254, 251, 244` | Fundos muito claros |
| **Base** | `#FDF8EE` | `253, 248, 238` | **Fundo padrão alternativo** |
| **Dark** | `#FAF4E6` | `250, 244, 230` | Separadores suaves |

---

## 💻 Como Usar

### **Método 1: Classes Tailwind (Recomendado)**

```jsx
// Backgrounds
<div className="bg-primary-500">Roxo Base</div>
<div className="bg-primary-50">Roxo Muito Claro</div>
<div className="bg-secondary-500">Verde Lima Base</div>
<div className="bg-neutral">Creme Neutro</div>

// Textos
<p className="text-primary-500">Texto Roxo</p>
<p className="text-secondary-600">Texto Verde Escuro</p>

// Bordas
<div className="border-2 border-primary-200">Com borda roxa clara</div>
<div className="border border-secondary-300">Com borda verde suave</div>
```

---

### **Método 2: CSS Variables**

```jsx
// Inline styles
<div style={{ 
  backgroundColor: 'rgb(var(--color-primary-500))' 
}}>
  Header Roxo
</div>

<p style={{ 
  color: 'rgb(var(--color-secondary-600))' 
}}>
  Texto Verde
</p>
```

---

### **Método 3: Hex Direto (Quando necessário)**

```jsx
// Para cores base apenas
<Button style={{ backgroundColor: '#4A2C60' }}>
  Botão Roxo
</Button>

<div style={{ color: '#C8E046' }}>
  Texto Verde Lima
</div>
```

---

## 🎨 Exemplos Práticos

### **1. Card com Gradiente Roxo**

```jsx
<Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
  <h3 className="text-primary-700">Título do Card</h3>
  <p className="text-primary-600">Conteúdo com hierarquia visual</p>
</Card>
```

### **2. Botão Primário com Hover**

```jsx
<button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white">
  Ação Principal
</button>
```

### **3. Badge de Sucesso**

```jsx
<Badge className="bg-secondary-100 text-secondary-700 border border-secondary-300">
  ✓ Completado
</Badge>
```

### **4. Header de Página**

```jsx
<header className="bg-primary-500 text-white">
  <div className="px-6 py-4">
    <h1 className="text-xl">Título da Página</h1>
    <p className="text-primary-100 text-sm">Subtítulo com contraste</p>
  </div>
</header>
```

### **5. Card de Informação com Verde**

```jsx
<div className="bg-secondary-50 border-l-4 border-secondary-500 p-4">
  <p className="text-secondary-900">
    ℹ️ Esta é uma informação importante
  </p>
</div>
```

---

## ✅ Boas Práticas

### **DO ✓ (Faça)**

1. **Use variações claras (50-200) para fundos**
   ```jsx
   <div className="bg-primary-50"> ✓ Fundo suave e agradável
   ```

2. **Use tons médios (400-600) para elementos interativos**
   ```jsx
   <button className="bg-primary-500 hover:bg-primary-600"> ✓
   ```

3. **Use tons escuros (700-900) para textos sobre fundos claros**
   ```jsx
   <p className="text-primary-700"> ✓ Alto contraste
   ```

4. **Combine roxo + verde de forma equilibrada**
   ```jsx
   <Card className="bg-primary-50 border-secondary-300"> ✓
   ```

5. **Use gradientes sutis para profundidade**
   ```jsx
   <div className="bg-gradient-to-r from-primary-500 to-primary-600"> ✓
   ```

---

### **DON'T ✗ (Evite)**

1. **❌ NÃO use cores muito escuras em fundos grandes**
   ```jsx
   <div className="bg-primary-900"> ✗ Muito pesado
   ```

2. **❌ NÃO misture muitas tonalidades no mesmo elemento**
   ```jsx
   <Card className="bg-primary-200 border-primary-500 text-primary-800"> ✗ Poluído
   ```

3. **❌ NÃO use verde lima como cor de texto principal**
   ```jsx
   <p className="text-secondary-500"> ✗ Difícil de ler
   ```

4. **❌ NÃO crie gradientes com saltos muito grandes**
   ```jsx
   <div className="bg-gradient-to-r from-primary-100 to-primary-900"> ✗ Contraste brutal
   ```

5. **❌ NÃO use inline styles quando classes existem**
   ```jsx
   <div style={{ backgroundColor: '#4A2C60' }}> ✗ Use bg-primary-500
   ```

---

## 🎯 Casos de Uso Específicos

### **Headers de Páginas**
- Background: `bg-primary-500`
- Texto: `text-white`
- Subtítulo: `text-primary-100`

### **Botões Primários**
- Normal: `bg-primary-500`
- Hover: `hover:bg-primary-600`
- Pressed: `active:bg-primary-700`

### **Botões Secundários**
- Normal: `bg-secondary-500`
- Hover: `hover:bg-secondary-600`
- Pressed: `active:bg-secondary-700`

### **Cards de Destaque**
- Background: `bg-gradient-to-br from-primary-50 to-secondary-50`
- Border: `border-2 border-primary-200`

### **Badges e Tags**
- Sucesso: `bg-secondary-100 text-secondary-700 border-secondary-300`
- Info: `bg-primary-100 text-primary-700 border-primary-300`

### **Textos sobre Fundo Branco**
- Título: `text-primary-700`
- Corpo: `text-primary-600`
- Secundário: `text-gray-600`

---

## 📊 Acessibilidade (WCAG)

### **Contrastes Seguros:**

✅ **Texto Escuro sobre Fundo Claro**
- `text-primary-700` sobre `bg-white` → ✓ AAA
- `text-primary-600` sobre `bg-primary-50` → ✓ AA
- `text-secondary-700` sobre `bg-secondary-50` → ✓ AAA

✅ **Texto Claro sobre Fundo Escuro**
- `text-white` sobre `bg-primary-500` → ✓ AAA
- `text-primary-50` sobre `bg-primary-700` → ✓ AA

❌ **Evitar:**
- `text-secondary-500` sobre `bg-white` → ✗ Falha contraste
- `text-primary-300` sobre `bg-primary-50` → ✗ Falha contraste

---

## 🚀 Quick Reference

```jsx
// BACKGROUNDS
bg-primary-50      // Roxo ultra claro
bg-primary-500     // Roxo BASE (#4A2C60)
bg-primary-700     // Roxo escuro

bg-secondary-50    // Verde ultra claro
bg-secondary-500   // Verde BASE (#C8E046)
bg-secondary-700   // Verde escuro

bg-neutral         // Creme neutro (#FDF8EE)
bg-white           // Branco puro

// TEXTOS
text-primary-700   // Roxo para títulos
text-primary-600   // Roxo para corpo
text-secondary-600 // Verde para destaques
text-gray-600      // Cinza para secundário

// BORDAS
border-primary-200 // Roxo suave
border-secondary-300 // Verde suave
border-gray-200    // Cinza suave
```

---

## 📚 Referência Completa

**Documentação Técnica:**
- `/styles/design-tokens.css` - Definições das variáveis
- `/styles/globals.css` - Configuração do tema

**Conceito de Design:**
- "Botânica Geométrica"
- Paleta harmônica 3 cores
- Acessibilidade WCAG 2.1 AA

---

**Última atualização:** 2024  
**Versão do Brandbook:** 2.0  
**Mantido por:** Equipe Mynis Design System
