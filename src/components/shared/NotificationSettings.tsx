import { Bell, BellOff, Calendar, TestTube } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { SmartNotificationManager } from '../../utils/notifications/smartNotifications';
import { toast } from 'sonner@2.0.3';

export default function NotificationSettings() {
  const [hasPermission, setHasPermission] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent24h: 0,
    sent1h: 0,
    byType: {} as Record<string, number>
  });
  const [upcomingNotifications, setUpcomingNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHasPermission(SmartNotificationManager.hasPermission());
    setStats(SmartNotificationManager.getStats());
    setUpcomingNotifications(SmartNotificationManager.getUpcomingNotifications());
  };

  const handleActivate = async () => {
    const granted = await SmartNotificationManager.requestPermission();
    if (granted) {
      setHasPermission(true);
    }
  };

  const handleTest = async () => {
    await SmartNotificationManager.testNotification();
  };

  const formatDateTime = (date: string, time: string) => {
    const d = new Date(date);
    const [hours, minutes] = time.split(':');
    d.setHours(parseInt(hours), parseInt(minutes));
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d.toDateString() === today.toDateString()) {
      return `Hoje às ${time}`;
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return `Amanhã às ${time}`;
    }
    
    return `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às ${time}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'estudo': return '📚';
      case 'revisita': return '🏠';
      case 'reuniao': return '🏛️';
      default: return '📅';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'estudo': return 'Estudo';
      case 'revisita': return 'Revisita';
      case 'reuniao': return 'Reunião';
      default: return 'Evento';
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: hasPermission ? 'rgba(74, 44, 96, 0.1)' : 'rgba(156, 163, 175, 0.1)' }}
          >
            {hasPermission ? (
              <Bell className="w-6 h-6" style={{ color: '#4A2C60' }} />
            ) : (
              <BellOff className="w-6 h-6 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">Notificações Inteligentes</h3>
              {hasPermission ? (
                <Badge className="bg-green-50 text-green-600 border-green-100">Ativo</Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-600 border-gray-200">Inativo</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {hasPermission 
                ? 'Você receberá lembretes 24h e 1h antes dos eventos'
                : 'Ative para receber lembretes de estudos e revisitas'}
            </p>
          </div>
        </div>

        {!hasPermission && (
          <Button 
            className="w-full h-12 mt-4 text-white hover:opacity-90 border-0"
            style={{ backgroundColor: '#4A2C60' }}
            onClick={handleActivate}
          >
            <Bell className="w-5 h-5 mr-2" />
            Ativar Notificações
          </Button>
        )}

        {hasPermission && (
          <Button 
            variant="outline"
            className="w-full h-12 mt-4"
            onClick={handleTest}
          >
            <TestTube className="w-5 h-5 mr-2" />
            Testar Notificação
          </Button>
        )}
      </Card>

      {/* Estatísticas */}
      {hasPermission && stats.total > 0 && (
        <Card className="p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Estatísticas de Notificações
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)' }}>
              <p className="text-sm text-gray-600">Total Agendadas</p>
              <p className="text-2xl font-medium" style={{ color: '#4A2C60' }}>{stats.total}</p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)' }}>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-medium" style={{ color: '#4A2C60' }}>{stats.pending}</p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(200, 224, 70, 0.1)' }}>
              <p className="text-sm text-gray-600">Enviadas 24h</p>
              <p className="text-2xl font-medium" style={{ color: '#4A2C60' }}>{stats.sent24h}</p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(200, 224, 70, 0.1)' }}>
              <p className="text-sm text-gray-600">Enviadas 1h</p>
              <p className="text-2xl font-medium" style={{ color: '#4A2C60' }}>{stats.sent1h}</p>
            </div>
          </div>

          {Object.keys(stats.byType).length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Por Tipo:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <Badge key={type} variant="outline" className="px-3 py-1">
                    {getTypeIcon(type)} {getTypeLabel(type)}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Próximas Notificações */}
      {hasPermission && upcomingNotifications.length > 0 && (
        <Card className="p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Próximas Notificações (48h)
          </h3>

          <div className="space-y-3">
            {upcomingNotifications.map((notification) => (
              <div 
                key={notification.id}
                className="p-4 rounded-lg border-2"
                style={{ borderColor: '#E5E7EB', backgroundColor: 'white' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium" style={{ color: '#4A2C60' }}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDateTime(notification.eventDate, notification.eventTime)}
                    </p>
                    {notification.metadata?.endereco && (
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {notification.metadata.endereco}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {!notification.sent24h && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          🕐 Lembrete 24h pendente
                        </Badge>
                      )}
                      {!notification.sent1h && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          ⏰ Lembrete 1h pendente
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Informação */}
      <Card className="p-6 bg-blue-50 border-blue-100">
        <div className="flex gap-3">
          <div className="flex-shrink-0 text-2xl">ℹ️</div>
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-1">Como Funcionam as Notificações</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>24h antes:</strong> Lembrete para se preparar</li>
              <li>• <strong>1h antes:</strong> Lembrete final para não esquecer</li>
              <li>• Sistema verifica eventos a cada 5 minutos</li>
              <li>• Notificações aparecem mesmo com app fechado</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
