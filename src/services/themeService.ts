/**
 * Theme Service - Gerencia o tema do aplicativo (Claro/Escuro/Automático)
 * Versão 2.0 - Aplica tema em body e cards
 */

export type TemaType = 'claro' | 'escuro' | 'auto';

const THEME_STORAGE_KEY = 'mynis-tema';

export class ThemeService {
  private static currentTheme: TemaType = 'claro';

  /**
   * Inicializa o tema baseado nas preferências salvas
   */
  static init(): void {
    const savedTheme = this.getTheme();
    this.applyTheme(savedTheme);
  }

  /**
   * Obtém o tema salvo no localStorage
   */
  static getTheme(): TemaType {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && (saved === 'claro' || saved === 'escuro' || saved === 'auto')) {
      return saved as TemaType;
    }
    return 'claro'; // Default
  }

  /**
   * Salva e aplica um novo tema
   */
  static setTheme(tema: TemaType): void {
    localStorage.setItem(THEME_STORAGE_KEY, tema);
    this.currentTheme = tema;
    this.applyTheme(tema);
    
    // Dispatch eventos para outros componentes reagirem
    window.dispatchEvent(new CustomEvent('theme-change', { detail: tema }));
    window.dispatchEvent(new Event('mynis-theme-change'));
  }

  /**
   * Aplica o tema no DOM
   */
  private static applyTheme(tema: TemaType): void {
    const root = document.documentElement;
    
    // Remove classes anteriores
    root.classList.remove('mynis-theme-claro', 'mynis-theme-escuro');
    
    if (tema === 'auto') {
      // Detecta preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const effectiveTheme = prefersDark ? 'escuro' : 'claro';
      root.classList.add(`mynis-theme-${effectiveTheme}`);
      this.applyStyles(effectiveTheme);
    } else {
      root.classList.add(`mynis-theme-${tema}`);
      this.applyStyles(tema);
    }
  }

  /**
   * Aplica estilos CSS no body
   */
  private static applyStyles(tema: 'claro' | 'escuro'): void {
    const body = document.body;

    if (tema === 'escuro') {
      // Tema Escuro
      body.style.backgroundColor = '#1A1A1A';
      body.style.color = '#FFFFFF';
    } else {
      // Tema Claro (padrão Mynis)
      body.style.backgroundColor = '#FDF8EE';
      body.style.color = '#1F2937';
    }
  }

  /**
   * Escuta mudanças na preferência do sistema (para tema automático)
   */
  static watchSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (this.currentTheme === 'auto') {
        const effectiveTheme = e.matches ? 'escuro' : 'claro';
        const root = document.documentElement;
        root.classList.remove('mynis-theme-claro', 'mynis-theme-escuro');
        root.classList.add(`mynis-theme-${effectiveTheme}`);
        this.applyStyles(effectiveTheme);
        // Dispatch evento customizado
        window.dispatchEvent(new Event('mynis-theme-change'));
      }
    });
  }

  /**
   * Obtém o tema efetivo (resolve 'auto' para 'claro' ou 'escuro')
   */
  static getEffectiveTheme(): 'claro' | 'escuro' {
    const savedTheme = this.getTheme();
    if (savedTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'escuro' : 'claro';
    }
    return savedTheme as 'claro' | 'escuro';
  }

  /**
   * Adiciona listener para mudanças de tema
   */
  static on(event: string, callback: () => void): void {
    if (event === 'mynis-theme-change') {
      window.addEventListener('mynis-theme-change', callback);
      window.addEventListener('theme-change', callback);
    }
  }

  /**
   * Remove listener de mudanças de tema
   */
  static off(event: string, callback: () => void): void {
    if (event === 'mynis-theme-change') {
      window.removeEventListener('mynis-theme-change', callback);
      window.removeEventListener('theme-change', callback);
    }
  }
}

// Inicializar o tema quando o módulo for carregado
if (typeof window !== 'undefined') {
  ThemeService.init();
  ThemeService.watchSystemTheme();
}