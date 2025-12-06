/**
 * LanguageService - Gerenciador de Idiomas do Mynis
 * 
 * Gerencia a seleção e persistência do idioma do aplicativo
 * Suporta: Português (Brasil), Español, English
 */

export type LanguageCode = 'pt-BR' | 'es' | 'en';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

const STORAGE_KEY = 'mynis-language';

export class LanguageService {
  private static currentLanguage: LanguageCode = 'pt-BR';
  private static listeners: Set<() => void> = new Set();

  // Idiomas disponíveis
  static readonly LANGUAGES: Language[] = [
    {
      code: 'pt-BR',
      name: 'Portuguese (Brazil)',
      nativeName: 'Português (Brasil)',
      flag: '🇧🇷'
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸'
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    }
  ];

  /**
   * Inicializa o serviço de idioma
   * Carrega o idioma salvo ou detecta o idioma do navegador
   */
  static init(): void {
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved && this.isValidLanguage(saved)) {
      this.currentLanguage = saved as LanguageCode;
    } else {
      // Detectar idioma do navegador
      const browserLang = navigator.language;
      
      if (browserLang.startsWith('pt')) {
        this.currentLanguage = 'pt-BR';
      } else if (browserLang.startsWith('es')) {
        this.currentLanguage = 'es';
      } else if (browserLang.startsWith('en')) {
        this.currentLanguage = 'en';
      } else {
        // Padrão: Português (Brasil)
        this.currentLanguage = 'pt-BR';
      }
      
      this.saveLanguage();
    }
  }

  /**
   * Retorna o idioma atual
   */
  static getLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  /**
   * Retorna os dados completos do idioma atual
   */
  static getCurrentLanguageData(): Language {
    return this.LANGUAGES.find(lang => lang.code === this.currentLanguage)!;
  }

  /**
   * Define um novo idioma
   */
  static setLanguage(code: LanguageCode): void {
    if (!this.isValidLanguage(code)) {
      console.error(`Idioma inválido: ${code}`);
      return;
    }

    this.currentLanguage = code;
    this.saveLanguage();
    this.notifyListeners();
  }

  /**
   * Salva o idioma no localStorage
   */
  private static saveLanguage(): void {
    localStorage.setItem(STORAGE_KEY, this.currentLanguage);
  }

  /**
   * Valida se o código de idioma é suportado
   */
  private static isValidLanguage(code: string): boolean {
    return this.LANGUAGES.some(lang => lang.code === code);
  }

  /**
   * Adiciona um listener para mudanças de idioma
   */
  static on(event: 'mynis-language-change', callback: () => void): void {
    this.listeners.add(callback);
  }

  /**
   * Remove um listener
   */
  static off(event: 'mynis-language-change', callback: () => void): void {
    this.listeners.delete(callback);
  }

  /**
   * Notifica todos os listeners
   */
  private static notifyListeners(): void {
    this.listeners.forEach(callback => callback());
    // Também dispara evento global para compatibilidade
    window.dispatchEvent(new Event('mynis-language-change'));
  }

  /**
   * Retorna todos os idiomas disponíveis
   */
  static getAvailableLanguages(): Language[] {
    return this.LANGUAGES;
  }

  /**
   * Retorna o nome nativo do idioma atual
   */
  static getCurrentLanguageName(): string {
    return this.getCurrentLanguageData().nativeName;
  }

  /**
   * Retorna a bandeira do idioma atual
   */
  static getCurrentLanguageFlag(): string {
    return this.getCurrentLanguageData().flag;
  }
}

// Inicializar ao carregar o módulo
LanguageService.init();
