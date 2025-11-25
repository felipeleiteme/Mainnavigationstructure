# ⚡ Referência Rápida - Mynis

**Guia de consulta rápida para desenvolvedores**

---

## 🎯 Estrutura do Projeto

```
mynis/
├── /components/           # Componentes React
│   ├── /pages/           # Páginas principais (23 arquivos)
│   ├── /tabs/            # 5 abas principais
│   ├── /shared/          # Componentes compartilhados
│   ├── /ui/              # ShadCN UI (não modificar)
│   └── /figma/           # Protegidos (não modificar)
│
├── /services/            # Lógica de negócio
│   ├── dataService.ts    # ⚠️ CORE - Gerenciamento de dados
│   └── seedData.ts       # Dados iniciais
│
├── /utils/               # Utilitários organizados
│   ├── /icons/           # Helpers de ícones
│   ├── /storage/         # localStorage management
│   ├── /notifications/   # Sistema de notificações
│   └── /helpers/         # Funções utilitárias
│
├── /data/                # Dados estáticos
│   └── qualidades.ts     # Qualidades espirituais
│
├── /docs/                # Documentação completa
│   ├── /project/         # Design, Brandbook, Architecture
│   └── /development/     # Guidelines, Changelog, Contributing
│
└── /styles/
    └── globals.css       # ⚠️ Design System - Não modificar tokens
```

---

## 🎨 Cores Oficiais (Brandbook)

### Primária
```css
--primary-500: #4A2C60    /* Roxo profundo */
--primary-400: #5E3877
--primary-600: #3A2250
```

### Secundária
```css
--secondary-500: #C8E046  /* Verde lima */
--secondary-400: #D4E870
--secondary-600: #B5CC3D
```

### Neutra
```css
--neutral-50: #FDF8EE     /* Fundo principal */
```

### Uso Rápido
```tsx
// Backgrounds
style={{ backgroundColor: '#4A2C60' }}  // Primário
style={{ backgroundColor: '#C8E046' }}  // Secundário
style={{ backgroundColor: '#FDF8EE' }}  // Neutro

// Border/Texto
style={{ color: '#4A2C60' }}
style={{ borderColor: '#C8E046' }}
```

---

## 🧩 Componentes Padrão

### Header Fixo (Padrão)
```tsx
<div className="sticky top-0 z-10" style={{ backgroundColor: '#4A2C60' }}>
  <div className="px-6 pt-12 pb-4">
    <h2 className="text-white">Título</h2>
  </div>
</div>
```

### Botão Primário (Padrão)
```tsx
<Button
  className="h-14 w-full text-white hover:opacity-90"
  style={{ backgroundColor: '#4A2C60' }}
>
  Texto do Botão
</Button>
```

### Botão Secundário
```tsx
<Button
  className="h-14 w-full hover:opacity-90"
  style={{ backgroundColor: '#C8E046', color: '#4A2C60' }}
>
  Texto do Botão
</Button>
```

### Card Padrão
```tsx
<Card className="p-5">
  <h3 className="mb-4" style={{ color: '#4A2C60' }}>Título</h3>
  <p className="text-sm text-gray-700">Conteúdo</p>
</Card>
```

### Badge Status
```tsx
// Nova (verde lima)
<Badge style={{ backgroundColor: '#C8E046', color: '#4A2C60' }}>
  Nova
</Badge>

// Ativa (roxo)
<Badge style={{ backgroundColor: '#F5F2F7', color: '#4A2C60' }}>
  Ativa
</Badge>
```

---

## 📦 Imports Comuns

### Ícones
```tsx
import { 
  Home, User, BookOpen, Calendar, 
  Plus, Edit, Trash2, ArrowLeft 
} from 'lucide-react';
```

### Componentes UI
```tsx
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { toast } from 'sonner@2.0.3';
```

### Serviços
```tsx
import { DataService } from '../services/dataService';
```

### Utilitários
```tsx
import { carregarDados } from '../utils/storage/leituraStorage';
import { MynisNotifications } from '../utils/notifications/notifications';
import { gerarProximasAcoes } from '../utils/helpers/proximasAcoes';
```

---

## 🚫 Não Fazer (Importante)

### ❌ Não Usar Classes de Tipografia
```tsx
// ❌ ERRADO
<h1 className="text-2xl font-bold leading-tight">

// ✅ CORRETO
<h1>Título</h1>  // Usa tipografia de globals.css
```

### ❌ Não Modificar Arquivos Protegidos
- `/components/ui/*` (ShadCN)
- `/components/figma/ImageWithFallback.tsx`
- `/styles/globals.css` (tokens)

### ❌ Não Usar Emojis
```tsx
// ❌ ERRADO
<p>📚 Estudos</p>

// ✅ CORRETO
<BookOpen className="w-5 h-5" />
```

---

## ✅ Padrões de Código

### Nomenclatura
```tsx
// Componentes: PascalCase
export default function NovaRevisitaPage() {}

// Funções: camelCase
function calcularProgresso() {}

// Constantes: UPPER_SNAKE_CASE
const STORAGE_KEY = 'mynis_data';
```

### Estado
```tsx
// useState
const [isLoading, setIsLoading] = useState(false);
const [dados, setDados] = useState<Tipo[]>([]);

// useEffect com dependências
useEffect(() => {
  carregarDados();
}, [dependencia]);
```

### Props
```tsx
interface ComponentProps {
  titulo: string;
  onVoltar: () => void;
  opcional?: boolean;
}

export default function Component({ titulo, onVoltar, opcional }: ComponentProps) {}
```

---

## 🎯 Tamanhos Padrão

### Heights
```tsx
h-14    // 56px - Botões principais, headers
h-12    // 48px - Botões secundários
h-10    // 40px - Inputs
h-8     // 32px - Botões pequenos
```

### Ícones
```tsx
className="w-5 h-5"    // 20px - Padrão
className="w-6 h-6"    // 24px - Grande
className="w-4 h-4"    // 16px - Pequeno
```

### Padding/Spacing
```tsx
px-6    // Padding horizontal padrão
py-4    // Padding vertical padrão
gap-4   // Gap padrão entre elementos
space-y-4   // Espaçamento vertical
```

---

## 📊 DataService (Core)

### Métodos Principais
```tsx
// Revisitas
DataService.getRevisitas()
DataService.adicionarRevisita(revisita)
DataService.atualizarRevisita(id, dados)
DataService.removerRevisita(id)

// Estudos Bíblicos
DataService.getEstudosBiblicos()
DataService.adicionarEstudoBiblico(estudo)
DataService.atualizarEstudoBiblico(id, dados)
DataService.removerEstudoBiblico(id)

// Sessões
DataService.getSessaoAtual()
DataService.iniciarSessao(dados)
DataService.finalizarSessao(id)

// Eventos
window.dispatchEvent(new Event('mynis-data-change'));
```

### Escutar Mudanças
```tsx
useEffect(() => {
  const handleDataChange = () => {
    carregarDados();
  };
  
  window.addEventListener('mynis-data-change', handleDataChange);
  
  return () => {
    window.removeEventListener('mynis-data-change', handleDataChange);
  };
}, []);
```

---

## 🔔 Notificações

### Toast Simples
```tsx
import { toast } from 'sonner@2.0.3';

toast('Mensagem de sucesso');
toast.success('Salvo com sucesso!');
toast.error('Erro ao salvar');
toast.info('Informação importante');
```

### Toast com Ação
```tsx
toast.success('Revisita adicionada', {
  description: 'Ana Silva foi adicionada à lista',
  action: {
    label: 'Desfazer',
    onClick: () => desfazerAcao(),
  },
});
```

---

## 📱 Responsividade

### Breakpoints
```tsx
// Mobile-first (padrão)
<div className="w-full">

// Tablet
<div className="md:w-1/2">

// Desktop
<div className="lg:w-1/3">
```

### Grid Responsivo
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 🧪 Testes Rápidos

### Verificar Imports
```bash
# Buscar por import específico
grep -r "import.*DataService" components/
```

### Verificar Uso de Componente
```bash
# Buscar onde componente é usado
grep -r "NovaRevisitaPage" components/
```

---

## 📚 Links Úteis

### Documentação
- [README](../README.md)
- [Design System](project/DESIGN_SYSTEM.md)
- [Guidelines](development/GUIDELINES.md)
- [Architecture](project/ARCHITECTURE.md)

### Ferramentas
- [Lucide Icons](https://lucide.dev/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🆘 Problemas Comuns

### Import não encontrado
```tsx
// ❌ ERRADO (caminho antigo)
import { carregarDados } from '../../utils/leituraStorage';

// ✅ CORRETO (caminho novo)
import { carregarDados } from '../../utils/storage/leituraStorage';
```

### DataService não atualiza UI
```tsx
// Sempre disparar evento após mudança
DataService.adicionarRevisita(revisita);
window.dispatchEvent(new Event('mynis-data-change'));
```

### Cor não aplicando
```tsx
// ❌ ERRADO (sem style)
<div className="bg-primary-500">

// ✅ CORRETO (com style inline)
<div style={{ backgroundColor: '#4A2C60' }}>
```

---

## 🎯 Checklist Rápido

### Antes de Commit
- [ ] Código segue guidelines
- [ ] Imports corretos (novos caminhos em /utils)
- [ ] Cores do brandbook usadas
- [ ] Zero classes de tipografia (text-*, font-*, leading-*)
- [ ] Ícones Lucide (não emojis)
- [ ] Botões com h-14
- [ ] Headers com sticky top-0 z-10
- [ ] DataService events disparados
- [ ] Testado funcionamento

### Antes de PR
- [ ] Código revisado
- [ ] Documentação atualizada (se necessário)
- [ ] Screenshots (se mudança visual)
- [ ] Descrição clara no PR

---

## 🚀 Comandos Úteis

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Rodar projeto
npm run dev

# Build
npm run build
```

### Busca
```bash
# Buscar texto em arquivos
grep -r "texto" .

# Buscar em arquivos TypeScript
find . -name "*.tsx" -o -name "*.ts" | xargs grep "texto"
```

---

**💡 Dica:** Mantenha este guia aberto enquanto desenvolve!

**Última Atualização:** Novembro 2024 (v2.1.0)
