import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { MynisNotifications } from '../../utils/notifications/notifications';
import { Bell } from 'lucide-react';
import { useTranslations } from '../../utils/i18n/translations';
import { ThemeService, TemaType } from '../../services/themeService';
import { LanguageService } from '../../services/languageService';

export default function NotificationDemo() {
  const [temaAtual, setTemaAtual] = useState<TemaType>(ThemeService.getEffectiveTheme());
  const [idiomaAtual, setIdiomaAtual] = useState(LanguageService.getLanguage());
  const t = useTranslations(idiomaAtual);

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };

    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Escutar mudanças de idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      setIdiomaAtual(LanguageService.getLanguage());
    };

    LanguageService.on('mynis-language-change', handleLanguageChange);
    return () => LanguageService.off('mynis-language-change', handleLanguageChange);
  }, []);

  // Componente de botão reutilizável
  const NotificationButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
      className="transition-all duration-200"
      style={{
        backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
        borderColor: temaAtual === 'escuro' ? '#4A5568' : '#D1D5DB',
        color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(74, 44, 96, 0.2)' : 'rgba(74, 44, 96, 0.05)';
        e.currentTarget.style.borderColor = '#4A2C60';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF';
        e.currentTarget.style.borderColor = temaAtual === 'escuro' ? '#4A5568' : '#D1D5DB';
      }}
    >
      {label}
    </Button>
  );

  return (
    <Card 
      className="p-6"
      style={{
        backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5" style={{ color: '#4A2C60' }} />
        <h3 
          style={{
            color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
          }}
        >
          {t.notificationTest.title}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {/* Lembrete de Estudo */}
        <NotificationButton
          label={t.notificationTest.studyReminder}
          onClick={() => MynisNotifications.lembreteEstudo('João Silva', '14h')}
        />
        
        {/* Cronograma Ideal */}
        <NotificationButton
          label={t.notificationTest.idealSchedule}
          onClick={() => MynisNotifications.lembreteMinisterio('Manhã')}
        />
        
        {/* Leitura da Bíblia */}
        <NotificationButton
          label={t.notificationTest.bibleReading}
          onClick={() => MynisNotifications.lembreteLeituraBiblia('Lucas 10')}
        />
        
        {/* Relatório */}
        <NotificationButton
          label={t.notificationTest.report}
          onClick={() => MynisNotifications.lembreteRelatorio(0)}
        />
        
        {/* Estudo Esquecido */}
        <NotificationButton
          label={t.notificationTest.forgottenStudy}
          onClick={() => MynisNotifications.estudoEsquecido('Maria', 15)}
        />
        
        {/* Pausa Campo */}
        <NotificationButton
          label={t.notificationTest.fieldPause}
          onClick={() => MynisNotifications.pausaInteligente()}
        />
        
        {/* Versículo */}
        <NotificationButton
          label={t.notificationTest.verse}
          onClick={() => MynisNotifications.versiculoEncorajador(
            'Não desista de fazer o que é excelente',
            'Gálatas 6:9'
          )}
        />
        
        {/* Celebração */}
        <NotificationButton
          label={t.notificationTest.celebration}
          onClick={() => MynisNotifications.celebracaoMeta('ofensiva', 30)}
        />

        {/* Encorajamento */}
        <NotificationButton
          label={t.notificationTest.encouragement}
          onClick={() => MynisNotifications.encorajamentoMeta(15, 5)}
        />

        {/* DPA Vencendo */}
        <NotificationButton
          label={t.notificationTest.dpaExpiring}
          onClick={() => MynisNotifications.dpaVencendo(25)}
        />

        {/* Boas-vindas */}
        <NotificationButton
          label={t.notificationTest.welcome}
          onClick={() => MynisNotifications.boasVindasDiaria('Felipe', new Date().getHours())}
        />

        {/* Aniversário */}
        <NotificationButton
          label={t.notificationTest.anniversary}
          onClick={() => MynisNotifications.aniversarioBatismo(14)}
        />

        {/* Texto Diário */}
        <NotificationButton
          label={t.notificationTest.dailyText}
          onClick={() => MynisNotifications.lembreteTextoDiario()}
        />

        {/* Sincronização Offline */}
        <NotificationButton
          label={t.notificationTest.syncOffline}
          onClick={() => MynisNotifications.sincronizacaoOffline()}
        />

        {/* Sincronização Completa */}
        <NotificationButton
          label={t.notificationTest.syncComplete}
          onClick={() => MynisNotifications.sincronizacaoCompleta()}
        />
      </div>

      <p 
        className="text-xs mt-4"
        style={{
          color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
        }}
      >
        {t.notificationTest.description}
      </p>
    </Card>
  );
}
