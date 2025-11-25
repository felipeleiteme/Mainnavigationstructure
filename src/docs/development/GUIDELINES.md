# 💻 Guidelines de Desenvolvimento - Mynis

**Padrões e boas práticas para desenvolvimento no Mynis**

---

## 📋 Índice

1. [Código](#código)
2. [Componentes React](#componentes-react)
3. [Estilo e CSS](#estilo-e-css)
4. [Tipos TypeScript](#tipos-typescript)
5. [Commits](#commits)
6. [Testes](#testes)

---

## 💻 Código

### Formatação
- **Indentação:** 2 espaços
- **Aspas:** Simples `'` para JavaScript, duplas `"` para JSX
- **Ponto e vírgula:** Sempre usar
- **Line length:** Máximo 100 caracteres

### Nomenclatura

```typescript
// Componentes: PascalCase
export default function MinhaComponent() {}

// Funções: camelCase
function handleClick() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_ITEMS = 10;

// Interfaces/Types: PascalCase
interface UserProfile {}
type Status = 'ativo' | 'inativo';
```

---

## ⚛️ Componentes React

### Estrutura de Componente

```tsx
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Home, User } from 'lucide-react';

interface MinhaComponentProps {
  titulo: string;
  onSalvar: () => void;
}

export default function MinhaComponent({ titulo, onSalvar }: MinhaComponentProps) {
  // 1. Hooks de estado
  const [loading, setLoading] = useState(false);
  
  // 2. Hooks de efeito
  useEffect(() => {
    // Lógica de efeito
  }, []);
  
  // 3. Funções handlers
  const handleSubmit = () => {
    // Lógica
  };
  
  // 4. Early returns
  if (loading) return <div>Carregando...</div>;
  
  // 5. Render
  return (
    <div>
      <h1>{titulo}</h1>
      <Button onClick={onSalvar}>Salvar</Button>
    </div>
  );
}
```

### Boas Práticas

✅ **DO (Faça)**
```tsx
// Componentes pequenos e focados
export default function UserCard({ user }: Props) {
  return <Card>...</Card>;
}

// Props com interface
interface Props {
  user: User;
  onEdit: (id: string) => void;
}

// Destructuring de props
export default function Button({ label, onClick }: ButtonProps) {}

// Keys únicas em listas
{items.map(item => <div key={item.id}>{item.nome}</div>)}
```

❌ **DON'T (Evite)**
```tsx
// Componentes gigantes (split em menores)
export default function GiantComponent() {
  // 500+ linhas ❌
}

// Props sem tipagem
export default function Button(props) {} // ❌

// Index como key
{items.map((item, index) => <div key={index}>{item}</div>)} // ❌

// Lógica complexa no JSX
{items.filter(x => x.active).map(x => x.id === selected ? ... : ...).sort()} // ❌
```

---

## 🎨 Estilo e CSS

### Tailwind CSS

```tsx
// ✅ Use classes do brandbook
<Button className="bg-primary-500 hover:opacity-90 text-white h-14">

// ✅ Agrupe classes logicamente
<div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">

// ❌ NÃO use cores fora do brandbook
<Button className="bg-green-600"> // ❌

// ❌ NÃO adicione tamanhos de fonte
<h1 className="text-2xl"> // ❌ Use h1 direto
```

### Classes Condicionais

```tsx
// Use template literals para condicionais simples
<div className={`base-class ${isActive ? 'active' : 'inactive'}`}>

// Use função helper para lógica complexa
import { cn } from './utils';
<div className={cn(
  'base-class',
  isActive && 'active-class',
  isDisabled && 'disabled-class'
)}>
```

---

## 📝 Tipos TypeScript

### Interfaces vs Types

```typescript
// Use interface para objetos
interface User {
  id: string;
  nome: string;
  email?: string;
}

// Use type para unions/primitives
type Status = 'ativo' | 'inativo' | 'pausado';
type ID = string | number;
```

### Props Tipadas

```typescript
// Props de componente
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Props com children
interface CardProps {
  children: React.ReactNode;
  title?: string;
}

// Props com eventos
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}
```

### DataService Types

```typescript
// Sempre tipados
const revisitas: Revisita[] = DataService.getRevisitas();
const estudo: Estudo | undefined = DataService.getEstudos().find(e => e.id === id);

// Use Omit para creates
DataService.adicionarRevisita({
  nome: 'João',
  endereco: 'Rua X',
  // ...
} as Omit<Revisita, 'id' | 'criadaEm'>);
```

---

## 📦 Commits

### Conventional Commits

```bash
# Features
feat: adiciona página de detalhes de revisita
feat(campo): implementa filtro por status

# Fixes
fix: corrige cálculo de progresso
fix(estudos): resolve bug ao deletar sessão

# Docs
docs: atualiza README com novas instruções
docs(api): documenta DataService

# Style
style: ajusta espaçamento do header
style(buttons): padroniza altura para 56px

# Refactor
refactor: move lógica de datas para utils
refactor(tabs): simplifica navegação

# Chore
chore: atualiza dependências
chore(build): otimiza configuração do vite
```

### Mensagens

✅ **Boas mensagens**
```
feat: adiciona histórico de visitas nas revisitas
fix: corrige sincronização ao deletar estudo
docs: atualiza guia de cores do brandbook
```

❌ **Mensagens ruins**
```
update
fix bug
changes
WIP
```

---

## 🧪 Testes

### Manual Testing Checklist

Antes de commitar, teste:

- [ ] Funcionalidade funciona no fluxo completo
- [ ] Dados são persistidos corretamente
- [ ] Eventos de sincronização funcionam
- [ ] Design system é respeitado (cores, tamanhos, espaçamentos)
- [ ] Responsive em mobile (360px mínimo)
- [ ] Não há erros no console
- [ ] Performance é aceitável
- [ ] Navegação back funciona
- [ ] Estados de loading/empty/error tratados

---

## 🚀 Workflow

### 1. Antes de Começar
```bash
# Atualizar branch
git pull origin main

# Criar feature branch
git checkout -b feat/nome-da-feature
```

### 2. Durante o Desenvolvimento
- Commitar frequentemente
- Seguir design system
- Testar continuamente
- Consultar documentação

### 3. Antes de Commitar
- Revisar código
- Remover console.logs
- Testar funcionalidade completa
- Verificar design system

### 4. Commit
```bash
git add .
git commit -m "feat: descrição clara"
git push origin feat/nome-da-feature
```

---

## 📚 Recursos

### Documentação Interna
- [Design System](../project/DESIGN_SYSTEM.md)
- [Brandbook](../project/BRANDBOOK.md)
- [Arquitetura](../project/ARCHITECTURE.md)

### Bibliotecas
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

---

## ❓ Dúvidas Frequentes

**Q: Posso usar outras cores além do roxo e verde?**  
A: Não. Use apenas as cores do brandbook (#4A2C60 e #C8E046).

**Q: Posso adicionar classes de tamanho de fonte?**  
A: Não. Use tags HTML semânticas (h1, h2, p) sem classes de tamanho.

**Q: Onde coloco componentes novos?**  
A: Em `/components/pages/` se for página, `/components/shared/` se for compartilhado.

**Q: Como persisto dados?**  
A: Sempre use o DataService, nunca manipule localStorage diretamente.

**Q: Posso usar emojis?**  
A: Não. Use ícones do Lucide React (w-6 h-6 padrão).

---

**Versão:** 2.0  
**Mantido por:** Equipe Mynis
