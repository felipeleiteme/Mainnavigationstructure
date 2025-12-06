import { toast } from 'sonner@2.0.3';

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationConfig {
  title: string;
  description?: string;
  duration?: number;
  action?: NotificationAction;
  type?: 'success' | 'info' | 'warning' | 'celebration';
}

// Sistema de Notificações do Mynis
export const MynisNotifications = {
  // 1. Lembretes de Estudos
  lembreteEstudo(nomeEstudante: string, horario: string) {
    toast.info(`Estudo com ${nomeEstudante} em 1 hora (${horario}) 📚`, {
      description: 'Prepare-se para um ótimo estudo!',
      duration: 10000,
      action: {
        label: 'Abrir',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'estudos' }));
        },
      },
    });
  },

  // 2. Cronograma Ideal (Rotina)
  lembreteMinisterio(periodo: string) {
    const emojis: Record<string, string> = {
      'Manhã': '☀️',
      'Tarde': '🌤️',
      'Noite': '🌙',
    };
    
    const saudacoes: Record<string, string> = {
      'Manhã': 'Bom dia',
      'Tarde': 'Boa tarde',
      'Noite': 'Boa noite',
    };

    toast.info(`${saudacoes[periodo]}! Hora do seu ministério ${emojis[periodo]}`, {
      description: 'Vamos abrir o cronômetro?',
      duration: 15000,
      action: {
        label: 'Iniciar Ministério',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('iniciar-ministerio'));
        },
      },
    });
  },

  // 3. Progresso de Meta (apenas se muito fora do ritmo)
  encorajamentoMeta(horasRestantes: number, diasRestantes: number) {
    if (horasRestantes > 0 && diasRestantes < 7) {
      toast('Continue firme! Um passo de cada vez 💪', {
        description: `${horasRestantes}h restantes. Você consegue!`,
        duration: 8000,
      });
    }
  },

  // 4. Lembretes Espirituais
  lembreteLeituraBiblia(capitulo: string) {
    toast('Que tal ler a Bíblia hoje? 📖', {
      description: `${capitulo} está esperando você`,
      duration: 10000,
      action: {
        label: 'Vamos lá!',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'espiritual' }));
        },
      },
    });
  },

  lembreteTextoDiario() {
    toast('Hora do texto diário ✨', {
      description: 'Um momento de reflexão para começar o dia',
      duration: 10000,
    });
  },

  // 5. Lembrete de Relatório
  lembreteRelatorio(diasRestantes: number) {
    const mensagem = diasRestantes === 0 
      ? 'Hoje é dia de enviar seu relatório! 📝'
      : `Lembre-se: relatório em ${diasRestantes} dias 📝`;
    
    toast(mensagem, {
      description: 'Quando puder, não esqueça de enviar',
      duration: 15000,
      action: {
        label: 'Abrir Relatório',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'perfil' }));
        },
      },
    });
  },

  // 6. Estudo Esquecido
  estudoEsquecido(nomeEstudante: string, diasSemVisita: number) {
    toast(`Que tal entrar em contato com ${nomeEstudante}? 💬`, {
      description: `Faz ${diasSemVisita} dias desde a última conversa`,
      duration: 12000,
      action: {
        label: 'Ver Estudo',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'estudos' }));
        },
      },
    });
  },

  // 7. Pausa Inteligente (durante Sessão)
  pausaInteligente() {
    toast('Você ainda está no campo? 🤔', {
      description: 'Notamos que você está parado há um tempo',
      duration: 20000,
      action: {
        label: 'Sim, continuar',
        onClick: () => {
          // Mantém sessão ativa
        },
      },
    });
  },

  // 8. Versículos Encorajadores
  versiculoEncorajador(versiculo: string, referencia: string) {
    toast.info(`"${versiculo}"`, {
      description: `— ${referencia}`,
      duration: 12000,
    });
  },

  // 9. Celebrações
  celebracaoMeta(tipo: 'mensal' | 'ofensiva' | 'marco', valor?: number) {
    const mensagens = {
      mensal: 'Parabéns! Você completou sua meta deste mês! 🎉',
      ofensiva: `Ofensiva de ${valor} dias de leitura! Incrível! 🔥`,
      marco: 'Você alcançou um marco importante! 🌟',
    };

    toast.success(mensagens[tipo], {
      description: 'Continue dando o seu melhor!',
      duration: 10000,
    });
  },

  // 10. Sincronização
  sincronizacaoOffline() {
    toast('Seus dados serão sincronizados quando conectar 📡', {
      description: 'Tudo está salvo localmente',
      duration: 5000,
    });
  },

  sincronizacaoCompleta() {
    toast.success('Dados sincronizados ✓', {
      description: 'Tudo atualizado na nuvem',
      duration: 3000,
    });
  },

  // 11. DPA Vencendo
  dpaVencendo(diasRestantes: number) {
    toast.warning('Documento de Diretivas Médicas vencendo', {
      description: `Vence em ${diasRestantes} dias. Lembre-se de renovar 🏥`,
      duration: 15000,
      action: {
        label: 'Ver Detalhes',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'perfil' }));
        },
      },
    });
  },

  // 12. Boas-vindas diária
  boasVindasDiaria(nome: string, hora: number) {
    let saudacao = 'Boa noite';
    let emoji = '🌙';
    
    if (hora < 12) {
      saudacao = 'Bom dia';
      emoji = '☀️';
    } else if (hora < 18) {
      saudacao = 'Boa tarde';
      emoji = '🌤️';
    }

    toast(`${saudacao}, ${nome}! ${emoji}`, {
      description: 'Que hoje seja um dia abençoado!',
      duration: 6000,
    });
  },

  // 13. Aniversário de Batismo
  aniversarioBatismo(anos: number) {
    toast.success(`${anos} anos de batismo! 🎂`, {
      description: 'Parabéns pela sua dedicação a Jeová!',
      duration: 10000,
    });
  },
};

// Gerenciador de Agendamento de Notificações
export class NotificationScheduler {
  private static readonly STORAGE_KEY = 'mynis_notifications_schedule';

  static scheduleEstudoReminder(estudoId: string, nomeEstudante: string, dataHora: Date) {
    const oneHourBefore = new Date(dataHora.getTime() - 60 * 60 * 1000);
    const now = new Date();
    
    if (oneHourBefore > now) {
      const timeUntil = oneHourBefore.getTime() - now.getTime();
      
      setTimeout(() => {
        const horario = dataHora.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        MynisNotifications.lembreteEstudo(nomeEstudante, horario);
      }, timeUntil);
    }
  }

  static checkCronogramaIdeal() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const cronograma = userData.cronograma;
    
    if (!cronograma) return;

    const now = new Date();
    const hour = now.getHours();
    const jsDay = now.getDay(); // 0=Dom, 1=Seg, 2=Ter, ..., 6=Sáb
    
    // Ajustar para o mapeamento do cronograma: 0=Seg, 1=Ter, ..., 6=Dom
    const cronogramaDay = jsDay === 0 ? 6 : jsDay - 1;
    
    let periodo = '';
    let periodoIndex = -1;
    
    if (hour >= 6 && hour < 12) {
      periodo = 'Manhã';
      periodoIndex = 0;
    } else if (hour >= 12 && hour < 18) {
      periodo = 'Tarde';
      periodoIndex = 1;
    } else if (hour >= 18 && hour < 22) {
      periodo = 'Noite';
      periodoIndex = 2;
    }

    if (periodoIndex >= 0 && cronograma[periodoIndex] && cronograma[periodoIndex][cronogramaDay]) {
      MynisNotifications.lembreteMinisterio(periodo);
    }
  }

  static checkLeituraBiblica() {
    const ultimaLeitura = localStorage.getItem('ultima_leitura_data');
    const hoje = new Date().toDateString();
    
    if (ultimaLeitura !== hoje) {
      MynisNotifications.lembreteLeituraBiblia('Lucas 10');
    }
  }

  static checkRelatorio() {
    const hoje = new Date().getDate();
    
    // Avisar nos últimos 3 dias do mês
    if (hoje >= 28) {
      const ultimoDia = new Date(
        new Date().getFullYear(), 
        new Date().getMonth() + 1, 
        0
      ).getDate();
      
      const diasRestantes = ultimoDia - hoje;
      MynisNotifications.lembreteRelatorio(diasRestantes);
    }
  }

  static checkEstudosEsquecidos() {
    const estudos = JSON.parse(localStorage.getItem('estudosBiblicos') || '[]');
    const hoje = new Date();
    
    estudos.forEach((estudo: any) => {
      if (estudo.ultimaVisitaData) {
        const ultimaVisita = new Date(estudo.ultimaVisitaData);
        const diasSemVisita = Math.floor(
          (hoje.getTime() - ultimaVisita.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (diasSemVisita >= 14) {
          MynisNotifications.estudoEsquecido(estudo.nome, diasSemVisita);
        }
      }
    });
  }

  static checkDPA() {
    const perfil = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (perfil.dpaValidade) {
      const validade = new Date(perfil.dpaValidade);
      const hoje = new Date();
      const diasRestantes = Math.floor(
        (validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diasRestantes <= 30 && diasRestantes > 0) {
        MynisNotifications.dpaVencendo(diasRestantes);
      }
    }
  }

  static checkAniversarioBatismo() {
    const perfil = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (perfil.dataBatismo) {
      const batismo = new Date(perfil.dataBatismo);
      const hoje = new Date();
      
      if (
        batismo.getDate() === hoje.getDate() && 
        batismo.getMonth() === hoje.getMonth()
      ) {
        const anos = hoje.getFullYear() - batismo.getFullYear();
        MynisNotifications.aniversarioBatismo(anos);
      }
    }
  }

  // Inicializar checagens diárias
  static initializeDailyChecks() {
    // Verificar imediatamente
    this.runDailyChecks();

    // Configurar verificação a cada hora
    setInterval(() => {
      this.runDailyChecks();
    }, 60 * 60 * 1000); // A cada hora
  }

  private static runDailyChecks() {
    const hour = new Date().getHours();
    
    // Boas-vindas (uma vez pela manhã)
    if (hour === 8) {
      const nome = JSON.parse(localStorage.getItem('userData') || '{}').nome || 'amigo';
      MynisNotifications.boasVindasDiaria(nome, hour);
    }

    // Leitura bíblica (lembrete suave à tarde)
    if (hour === 15) {
      this.checkLeituraBiblica();
    }

    // Cronograma ideal (verificar nos horários de campo)
    if ([8, 14, 19].includes(hour)) {
      this.checkCronogramaIdeal();
    }

    // Relatório (últimos dias do mês)
    if (hour === 10) {
      this.checkRelatorio();
    }

    // Estudos esquecidos (uma vez por semana)
    if (hour === 10 && new Date().getDay() === 1) {
      this.checkEstudosEsquecidos();
    }

    // DPA (verificar mensalmente)
    if (hour === 10 && new Date().getDate() === 1) {
      this.checkDPA();
    }

    // Aniversário de batismo
    if (hour === 9) {
      this.checkAniversarioBatismo();
    }
  }
}