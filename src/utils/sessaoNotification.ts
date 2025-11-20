/**
 * Sistema de Notificação Persistente para Sessão de Ministério
 * Utiliza Web Notifications API para manter usuário informado
 */

export class SessaoNotificationService {
  private static notification: Notification | null = null;
  private static updateInterval: NodeJS.Timeout | null = null;

  /**
   * Solicita permissão para notificações
   */
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Cria notificação persistente para sessão ativa
   */
  static async criarNotificacaoSessao(tempoDecorrido: number): Promise<void> {
    const temPermissao = await this.requestPermission();
    if (!temPermissao) return;

    // Fechar notificação anterior se existir
    this.fecharNotificacao();

    // Formatar tempo
    const horas = Math.floor(tempoDecorrido / 60);
    const minutos = tempoDecorrido % 60;
    const tempoFormatado = horas > 0
      ? `${horas}h${minutos.toString().padStart(2, '0')}min`
      : `${minutos}min`;

    // Criar nova notificação
    this.notification = new Notification('Sessão de Ministério em andamento', {
      body: `⏱️ ${tempoFormatado} decorridos`,
      icon: '/icon-192.png',
      badge: '/icon-badge.png',
      tag: 'sessao-ministerio', // Garante que só uma notificação apareça
      requireInteraction: true, // Notificação persiste até ser fechada
      silent: true, // Não emite som
      data: {
        tempoDecorrido,
        url: window.location.href,
      },
    });

    // Handler para quando usuário clicar na notificação
    this.notification.onclick = () => {
      window.focus();
      // Navegar para tab Campo se possível
      window.dispatchEvent(new CustomEvent('navigate-to-tab', {
        detail: 'campo'
      }));
      this.notification?.close();
    };

    // Atualizar notificação a cada minuto
    this.updateInterval = setInterval(() => {
      this.atualizarNotificacao(tempoDecorrido + 1);
    }, 60000); // 60 segundos
  }

  /**
   * Atualiza o tempo da notificação
   */
  private static atualizarNotificacao(novoTempo: number): void {
    // Fechar notificação atual
    if (this.notification) {
      this.notification.close();
    }

    // Criar nova notificação com tempo atualizado
    const horas = Math.floor(novoTempo / 60);
    const minutos = novoTempo % 60;
    const tempoFormatado = horas > 0
      ? `${horas}h${minutos.toString().padStart(2, '0')}min`
      : `${minutos}min`;

    this.notification = new Notification('Sessão de Ministério em andamento', {
      body: `⏱️ ${tempoFormatado} decorridos`,
      icon: '/icon-192.png',
      badge: '/icon-badge.png',
      tag: 'sessao-ministerio',
      requireInteraction: true,
      silent: true,
    });

    this.notification.onclick = () => {
      window.focus();
      window.dispatchEvent(new CustomEvent('navigate-to-tab', {
        detail: 'campo'
      }));
      this.notification?.close();
    };
  }

  /**
   * Fecha notificação e limpa intervalo
   */
  static fecharNotificacao(): void {
    if (this.notification) {
      this.notification.close();
      this.notification = null;
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Atualiza notificação quando sessão é pausada
   */
  static notificarPausa(tempoDecorrido: number): void {
    this.fecharNotificacao();

    const horas = Math.floor(tempoDecorrido / 60);
    const minutos = tempoDecorrido % 60;
    const tempoFormatado = horas > 0
      ? `${horas}h${minutos.toString().padStart(2, '0')}min`
      : `${minutos}min`;

    // Notificação temporária de pausa
    if (Notification.permission === 'granted') {
      const notification = new Notification('Sessão Pausada', {
        body: `⏸️ Pausado em ${tempoFormatado}`,
        icon: '/icon-192.png',
        tag: 'sessao-ministerio-pausa',
        requireInteraction: false,
        silent: true,
      });

      // Fechar automaticamente após 3 segundos
      setTimeout(() => notification.close(), 3000);
    }
  }

  /**
   * Notifica finalização da sessão
   */
  static notificarFinalizacao(tempoTotal: number): void {
    this.fecharNotificacao();

    const horas = Math.floor(tempoTotal / 60);
    const minutos = tempoTotal % 60;
    const tempoFormatado = horas > 0
      ? `${horas}h${minutos > 0 ? minutos + 'min' : ''}`
      : `${minutos}min`;

    if (Notification.permission === 'granted') {
      const notification = new Notification('Sessão Finalizada! 🎉', {
        body: `Parabéns! ${tempoFormatado} de serviço sagrado`,
        icon: '/icon-192.png',
        tag: 'sessao-ministerio-fim',
        requireInteraction: false,
      });

      // Fechar automaticamente após 5 segundos
      setTimeout(() => notification.close(), 5000);
    }
  }

  /**
   * Verifica se há suporte para notificações
   */
  static get isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Verifica se permissão foi concedida
   */
  static get hasPermission(): boolean {
    return Notification.permission === 'granted';
  }
}
