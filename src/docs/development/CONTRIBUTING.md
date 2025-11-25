# 🤝 Guia de Contribuição - Mynis

Obrigado pelo interesse em contribuir com o Mynis! Este documento fornece diretrizes para contribuir com o projeto.

---

## 📋 Código de Conduta

- Seja respeitoso e profissional
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Demonstre empatia com outros contribuidores

---

## 🚀 Como Contribuir

### 1. Reportar Bugs

Para reportar um bug, forneça:

**Informações Necessárias:**
- [ ] Descrição clara e concisa do problema
- [ ] Passos para reproduzir
- [ ] Comportamento esperado vs. comportamento atual
- [ ] Screenshots (se aplicável)
- [ ] Navegador e versão
- [ ] Sistema operacional

**Template de Bug Report:**
```markdown
## Descrição
[Descreva o bug de forma clara]

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que realmente acontece]

## Screenshots
[Se aplicável]

## Ambiente
- Navegador: [ex. Chrome 120]
- OS: [ex. Windows 11]
- Versão do Mynis: [ex. 2.0.0]
```

---

### 2. Sugerir Features

Para sugerir uma nova funcionalidade:

**Informações Necessárias:**
- [ ] Descrição clara da feature
- [ ] Problema que ela resolve
- [ ] Casos de uso
- [ ] Mockups/exemplos (se possível)

**Template de Feature Request:**
```markdown
## Descrição da Feature
[Descreva a funcionalidade proposta]

## Problema que Resolve
[Que problema esta feature resolve?]

## Solução Proposta
[Como esta feature resolveria o problema?]

## Alternativas Consideradas
[Outras soluções que você considerou?]

## Casos de Uso
1. [Exemplo de uso 1]
2. [Exemplo de uso 2]

## Mockups/Exemplos
[Imagens ou exemplos, se houver]
```

---

### 3. Contribuir com Código

#### Setup do Ambiente

```bash
# 1. Fork o repositório no GitHub

# 2. Clone seu fork
git clone [url-do-seu-fork]
cd mynis

# 3. Adicione o repositório original como upstream
git remote add upstream [url-repositorio-original]

# 4. Instale dependências
npm install

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

#### Workflow de Desenvolvimento

```bash
# 1. Crie uma branch para sua feature
git checkout -b feat/nome-da-feature

# 2. Faça suas mudanças
# [desenvolvimento]

# 3. Teste suas mudanças
npm run dev

# 4. Commit com mensagem descritiva
git commit -m "feat: adiciona [descrição]"

# 5. Push para seu fork
git push origin feat/nome-da-feature

# 6. Abra um Pull Request no GitHub
```

#### Padrões de Código

✅ **Siga sempre:**
- [Design System](../project/DESIGN_SYSTEM.md)
- [Guidelines de Desenvolvimento](./GUIDELINES.md)
- [Brandbook de Cores](../project/BRANDBOOK.md)

**Checklist antes de abrir PR:**
- [ ] Código segue as guidelines
- [ ] Design System respeitado (cores, tamanhos, espaçamentos)
- [ ] Componentes tipados (TypeScript)
- [ ] Sem erros no console
- [ ] Funciona em mobile (360px+)
- [ ] Dados persistem corretamente
- [ ] Sincronização funciona
- [ ] Commits seguem Conventional Commits

---

### 4. Melhorar Documentação

Documentação é sempre bem-vinda!

**Tipos de contribuição em docs:**
- Corrigir erros de digitação
- Melhorar clareza de explicações
- Adicionar exemplos
- Traduzir para outros idiomas
- Atualizar informações desatualizadas

**Arquivos de documentação:**
- `/README.md` - Documentação principal
- `/docs/project/` - Documentação do projeto
- `/docs/development/` - Guias de desenvolvimento
- Comentários inline no código

---

## 📝 Padrões de Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição curta

[corpo opcional]

[rodapé opcional]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, estilo
- `refactor`: Refatoração de código
- `test`: Testes
- `chore`: Manutenção

**Exemplos:**
```bash
feat(campo): adiciona filtro por status nas revisitas
fix(estudos): corrige cálculo de progresso
docs(readme): atualiza instruções de instalação
style(buttons): padroniza altura para 56px
refactor(dataservice): melhora performance de queries
```

---

## 🎨 Padrões de Design

### Cores
- **Roxo:** `#4A2C60` (primária)
- **Verde Lima:** `#C8E046` (secundária)
- **Neutro:** `#FDF8EE` (fundos)

### Componentes
- **Botões:** `h-14` (56px)
- **Headers:** `h-14 bg-primary-500 text-white sticky top-0 z-50`
- **Ícones:** `w-6 h-6` (24px padrão)
- **Cards:** `p-4`
- **Gaps:** Múltiplos de 8px

### Não use
- ❌ Cores fora do brandbook
- ❌ Emojis (use ícones Lucide React)
- ❌ Classes de tamanho de fonte
- ❌ Alturas customizadas de botão

---

## 🧪 Testes

Antes de submeter, teste:

### Manual Testing
- [ ] Funcionalidade funciona do início ao fim
- [ ] Dados são salvos corretamente
- [ ] Sincronização entre componentes funciona
- [ ] Design System respeitado
- [ ] Responsivo (mobile 360px+)
- [ ] Sem erros no console
- [ ] Performance aceitável
- [ ] Navegação back funciona

### Browser Testing
Teste em pelo menos:
- [ ] Chrome (última versão)
- [ ] Firefox (última versão)
- [ ] Safari (última versão)
- [ ] Mobile (Chrome/Safari)

---

## 📦 Pull Request

### Template de PR

```markdown
## Descrição
[Descreva as mudanças feitas]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Código segue as guidelines
- [ ] Design System respeitado
- [ ] Componentes tipados
- [ ] Testado manualmente
- [ ] Sem erros no console
- [ ] Funciona em mobile
- [ ] Documentação atualizada (se necessário)

## Screenshots
[Adicione screenshots se houver mudanças visuais]

## Issues Relacionadas
Closes #[número-da-issue]
```

### Processo de Review

1. **Automated Checks** - Lint, build
2. **Code Review** - Revisor verifica código
3. **Design Review** - Verifica Design System
4. **Testing** - Testa funcionalidade
5. **Merge** - Se aprovado, merge para main

---

## 🆘 Precisa de Ajuda?

- 📚 Leia a [documentação completa](../INDEX.md)
- 💬 Abra uma [Discussion no GitHub]
- 📧 Entre em contato com o time

---

## 🏆 Reconhecimento

Todos os contribuidores são reconhecidos no README do projeto!

---

**Obrigado por contribuir com o Mynis! 💜**

---

**Última Atualização:** 2024  
**Mantido por:** Equipe Mynis
