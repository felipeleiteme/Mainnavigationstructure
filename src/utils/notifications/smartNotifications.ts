/**
 * Sistema Inteligente de Notificações do Mynis
 * 
 * Features:
 * - Notificações nativas do navegador (Web Notifications API)
 * - Agendamento 24h e 1h antes dos eventos
 * - Verificação periódica de eventos agendados
 * - Persistência no localStorage
 * - Fallback para toast quando notificação nativa não disponível
 */

import { toast } from 'sonner@2.0.3';
import { MynisNotifications } from './notifications';

// ===== INTERFACES =====

export interface NotificationSchedule {
  id: string;
  type: 'estudo' | 'revisita' | 'reuniao' | 'outro';
  title: string;
  description: string;
  eventDate: string; // ISO date
  eventTime: string; // HH:mm
  sent24h: boolean;
  sent1h: boolean;
  metadata?: {
    estudoId?: string;
    revisitaId?: string;
    nomeEstudante?: string;
    endereco?: string;
  };
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  lastAsked?: string;
}

// ===== SMART NOTIFICATION MANAGER =====

export class SmartNotificationManager {
  private static readonly STORAGE_KEY = 'mynis_notification_schedules';
  private static readonly PERMISSION_KEY = 'mynis_notification_permission';
  private static readonly CHECK_INTERVAL = 5 * 60 * 1000; // Verificar a cada 5 minutos
  private static checkIntervalId: number | null = null;

  // ===== PERMISSÕES =====

  /**
   * Solicita permissão para notificações nativas
   */
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('📱 Notificações não suportadas neste navegador');
      return false;
    }

    // Já tem permissão
    if (Notification.permission === 'granted') {
      this.savePermission({ granted: true, denied: false });
      return true;
    }

    // Já negou
    if (Notification.permission === 'denied') {
      this.savePermission({ granted: false, denied: true });
      return false;
    }

    // Solicitar permissão
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      this.savePermission({ 
        granted, 
        denied: !granted,
        lastAsked: new Date().toISOString()
      });

      if (granted) {
        toast.success('Notificações ativadas! 🔔', {
          description: 'Você receberá lembretes de estudos e revisitas'
        });
      } else {
        toast.info('Notificações desativadas', {
          description: 'Você pode ativar depois nas configurações'
        });
      }

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  }

  /**
   * Verifica se tem permissão para notificações
   */
  static hasPermission(): boolean {
    if (!('Notification' in window)) return false;
    return Notification.permission === 'granted';
  }

  /**
   * Salva estado da permissão
   */
  private static savePermission(permission: NotificationPermission): void {
    localStorage.setItem(this.PERMISSION_KEY, JSON.stringify(permission));
  }

  /**
   * Recupera estado da permissão
   */
  static getPermission(): NotificationPermission {
    const data = localStorage.getItem(this.PERMISSION_KEY);
    if (!data) return { granted: false, denied: false };
    return JSON.parse(data);
  }

  // ===== AGENDAMENTO =====

  /**
   * Agenda notificações para um estudo (24h e 1h antes)
   */
  static scheduleEstudoNotification(
    estudoId: string,
    nomeEstudante: string,
    data: string,
    horario: string,
    endereco?: string
  ): void {
    const schedule: NotificationSchedule = {
      id: `estudo_${estudoId}_${Date.now()}`,
      type: 'estudo',
      title: `Estudo com ${nomeEstudante}`,
      description: `Hoje às ${horario}${endereco ? ` em ${endereco}` : ''}`,
      eventDate: data,
      eventTime: horario,
      sent24h: false,
      sent1h: false,
      metadata: {
        estudoId,
        nomeEstudante,
        endereco
      }
    };

    this.addSchedule(schedule);
    
    toast.success('Lembretes agendados 🔔', {
      description: 'Você será notificado 24h e 1h antes do estudo'
    });
  }

  /**
   * Agenda notificações para uma revisita (24h e 1h antes)
   */
  static scheduleRevisitaNotification(
    revisitaId: string,
    nomeRevisita: string,
    data: string,
    horario: string,
    endereco?: string
  ): void {
    const schedule: NotificationSchedule = {
      id: `revisita_${revisitaId}_${Date.now()}`,
      type: 'revisita',
      title: `Revisita com ${nomeRevisita}`,
      description: `Hoje às ${horario}${endereco ? ` em ${endereco}` : ''}`,
      eventDate: data,
      eventTime: horario,
      sent24h: false,
      sent1h: false,
      metadata: {
        revisitaId,
        nomeEstudante: nomeRevisita,
        endereco
      }
    };

    this.addSchedule(schedule);
    
    toast.success('Lembretes agendados 🔔', {
      description: 'Você será notificado 24h e 1h antes da revisita'
    });
  }

  /**
   * Adiciona uma notificação agendada
   */
  private static addSchedule(schedule: NotificationSchedule): void {
    const schedules = this.getAllSchedules();
    schedules.push(schedule);
    this.saveSchedules(schedules);
  }

  /**
   * Remove notificações agendadas por ID de estudo/revisita
   */
  static removeSchedulesByEntity(entityId: string): void {
    const schedules = this.getAllSchedules();
    const filtered = schedules.filter(s => {
      const metaId = s.metadata?.estudoId || s.metadata?.revisitaId;
      return metaId !== entityId;
    });
    this.saveSchedules(filtered);
  }

  /**
   * Limpa notificações antigas (eventos que já passaram)
   */
  static cleanOldSchedules(): void {
    const schedules = this.getAllSchedules();
    const now = new Date();
    
    const active = schedules.filter(schedule => {
      const eventDateTime = this.getEventDateTime(schedule);
      return eventDateTime > now;
    });

    if (active.length !== schedules.length) {
      this.saveSchedules(active);
      console.log(`🧹 Limpou ${schedules.length - active.length} notificações antigas`);
    }
  }

  // ===== VERIFICAÇÃO E ENVIO =====

  /**
   * Verifica e envia notificações pendentes
   */
  static checkAndSendNotifications(): void {
    const schedules = this.getAllSchedules();
    const now = new Date();
    let updated = false;

    schedules.forEach(schedule => {
      const eventDateTime = this.getEventDateTime(schedule);
      const timeDiff = eventDateTime.getTime() - now.getTime();
      
      // 24 horas = 86400000 ms
      // Janela de 24h: entre 24h e 23h50min antes (10 min de margem)
      const is24hWindow = timeDiff <= 86400000 && timeDiff >= 85800000;
      
      // 1 hora = 3600000 ms
      // Janela de 1h: entre 1h e 55min antes (5 min de margem)
      const is1hWindow = timeDiff <= 3600000 && timeDiff >= 3300000;

      // Enviar notificação de 24h
      if (is24hWindow && !schedule.sent24h) {
        this.sendNotification24h(schedule);
        schedule.sent24h = true;
        updated = true;
      }

      // Enviar notificação de 1h
      if (is1hWindow && !schedule.sent1h) {
        this.sendNotification1h(schedule);
        schedule.sent1h = true;
        updated = true;
      }
    });

    if (updated) {
      this.saveSchedules(schedules);
    }
  }

  /**
   * Envia notificação 24h antes
   */
  private static sendNotification24h(schedule: NotificationSchedule): void {
    const icon = this.getIconForType(schedule.type);
    const nomeEvento = schedule.metadata?.nomeEstudante || 'evento';
    
    this.sendNativeNotification(
      `🗓️ Lembrete: ${schedule.title}`,
      `Amanhã às ${schedule.eventTime}. Prepare-se!`,
      icon
    );

    // Fallback para toast
    toast.info(`Lembrete de ${schedule.type} ${icon}`, {
      description: `Amanhã: ${nomeEvento} às ${schedule.eventTime}`,
      duration: 15000,
      action: {
        label: 'Ver detalhes',
        onClick: () => {
          const tab = schedule.type === 'estudo' ? 'estudos' : 'campo';
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: tab }));
        }
      }
    });
  }

  /**
   * Envia notificação 1h antes
   */
  private static sendNotification1h(schedule: NotificationSchedule): void {
    const icon = this.getIconForType(schedule.type);
    const nomeEvento = schedule.metadata?.nomeEstudante || 'evento';
    
    this.sendNativeNotification(
      `⏰ Em 1 hora: ${schedule.title}`,
      `Às ${schedule.eventTime}. Está preparado?`,
      icon
    );

    // Fallback para toast
    toast.info(`${schedule.type} em 1 hora ${icon}`, {
      description: `${nomeEvento} às ${schedule.eventTime}`,
      duration: 20000,
      action: {
        label: 'Abrir',
        onClick: () => {
          const tab = schedule.type === 'estudo' ? 'estudos' : 'campo';
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: tab }));
        }
      }
    });
  }

  /**
   * Envia notificação nativa do navegador
   */
  private static sendNativeNotification(
    title: string,
    body: string,
    icon?: string
  ): void {
    if (!this.hasPermission()) return;

    try {
      const notification = new Notification(title, {
        body,
        icon: icon || '/logo-mynis.png',
        badge: '/logo-mynis.png',
        tag: `mynis-${Date.now()}`,
        requireInteraction: true, // Não some automaticamente
        silent: false,
        vibrate: [200, 100, 200]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Erro ao enviar notificação nativa:', error);
    }
  }

  // ===== HELPERS =====

  /**
   * Combina data e horário em um Date
   */
  private static getEventDateTime(schedule: NotificationSchedule): Date {
    const [hours, minutes] = schedule.eventTime.split(':').map(Number);
    const date = new Date(schedule.eventDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  /**
   * Retorna ícone para o tipo de evento
   */
  private static getIconForType(type: string): string {
    const icons: Record<string, string> = {
      estudo: '📚',
      revisita: '🏠',
      reuniao: '🏛️',
      outro: '📅'
    };
    return icons[type] || '📅';
  }

  /**
   * Salva agendamentos no localStorage
   */
  private static saveSchedules(schedules: NotificationSchedule[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(schedules));
  }

  /**
   * Recupera todos os agendamentos
   */
  static getAllSchedules(): NotificationSchedule[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  }

  /**
   * Recupera agendamentos de um tipo específico
   */
  static getSchedulesByType(type: 'estudo' | 'revisita' | 'reuniao' | 'outro'): NotificationSchedule[] {
    return this.getAllSchedules().filter(s => s.type === type);
  }

  /**
   * Recupera próximas notificações (próximas 48h)
   */
  static getUpcomingNotifications(): NotificationSchedule[] {
    const schedules = this.getAllSchedules();
    const now = new Date();
    const next48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    return schedules
      .filter(schedule => {
        const eventDateTime = this.getEventDateTime(schedule);
        return eventDateTime >= now && eventDateTime <= next48h;
      })
      .sort((a, b) => {
        const dateA = this.getEventDateTime(a);
        const dateB = this.getEventDateTime(b);
        return dateA.getTime() - dateB.getTime();
      });
  }

  // ===== INICIALIZAÇÃO =====

  /**
   * Inicializa o sistema de notificações
   */
  static initialize(): void {
    console.log('🔔 Inicializando sistema de notificações...');

    // Limpar notificações antigas
    this.cleanOldSchedules();

    // Primeira verificação imediata
    this.checkAndSendNotifications();

    // Configurar verificações periódicas
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
    }

    this.checkIntervalId = window.setInterval(() => {
      this.checkAndSendNotifications();
      this.cleanOldSchedules();
    }, this.CHECK_INTERVAL);

    console.log(`✅ Sistema de notificações ativo (verificação a cada 5 minutos)`);
  }

  /**
   * Para o sistema de notificações
   */
  static stop(): void {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
      console.log('🔕 Sistema de notificações pausado');
    }
  }

  /**
   * Testa envio de notificação
   */
  static async testNotification(): Promise<void> {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      toast.error('Permissão negada', {
        description: 'Ative as notificações nas configurações do navegador'
      });
      return;
    }

    this.sendNativeNotification(
      '🎉 Notificações funcionando!',
      'Você receberá lembretes de estudos e revisitas',
      undefined
    );

    toast.success('Teste de notificação enviado! 🔔', {
      description: 'Verificar se apareceu a notificação nativa'
    });
  }

  // ===== ESTATÍSTICAS =====

  /**
   * Retorna estatísticas de notificações
   */
  static getStats(): {
    total: number;
    pending: number;
    sent24h: number;
    sent1h: number;
    byType: Record<string, number>;
  } {
    const schedules = this.getAllSchedules();
    
    return {
      total: schedules.length,
      pending: schedules.filter(s => !s.sent24h || !s.sent1h).length,
      sent24h: schedules.filter(s => s.sent24h).length,
      sent1h: schedules.filter(s => s.sent1h).length,
      byType: schedules.reduce((acc, s) => {
        acc[s.type] = (acc[s.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

// Auto-inicializar quando o módulo é carregado
if (typeof window !== 'undefined') {
  // Aguardar 3 segundos após o carregamento para não impactar performance
  setTimeout(() => {
    SmartNotificationManager.initialize();
  }, 3000);
}
