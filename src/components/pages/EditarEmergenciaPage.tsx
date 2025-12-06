import { ArrowLeft, AlertTriangle, AlertCircle, Check, FileHeart, Phone, Calendar, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { DataService } from '../../services/dataService';
import { ThemeService } from '../../services/themeService';
import { LanguageService } from '../../services/languageService';
import { useTranslations } from '../../utils/i18n/translations';

interface EditarEmergenciaPageProps {
  onVoltar: () => void;
}

export default function EditarEmergenciaPage({ onVoltar }: EditarEmergenciaPageProps) {
  const [validadeDPA, setValidadeDPA] = useState('2025-12-15');
  const [contatoEmergencia, setContatoEmergencia] = useState('Ana Silva');
  const [telefoneEmergencia, setTelefoneEmergencia] = useState('(11) 98765-4321');
  const [alergias, setAlergias] = useState('');
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const [idiomaAtual, setIdiomaAtual] = useState(LanguageService.getLanguage());

  // Obter traduções
  const t = useTranslations(idiomaAtual);

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Escutar mudanças de tema
  useEffect(() => {
    const handleThemeChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleThemeChange);
    return () => ThemeService.off('mynis-theme-change', handleThemeChange);
  }, []);

  // Escutar mudanças de idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      setIdiomaAtual(LanguageService.getLanguage());
    };
    LanguageService.on('mynis-language-change', handleLanguageChange);
    return () => LanguageService.off('mynis-language-change', handleLanguageChange);
  }, []);

  const handleSalvar = () => {
    if (!validadeDPA) {
      toast.error(t.emergency.toastErrorValidityTitle, {
        description: t.emergency.toastErrorValidityDesc,
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    if (!contatoEmergencia.trim()) {
      toast.error(t.emergency.toastErrorContactTitle, {
        description: t.emergency.toastErrorContactDesc,
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    if (!telefoneEmergencia.trim()) {
      toast.error(t.emergency.toastErrorPhoneTitle, {
        description: t.emergency.toastErrorPhoneDesc,
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    // Verificar se a data está próxima de vencer (30 dias)
    const dataValidade = new Date(validadeDPA);
    const hoje = new Date();
    const diasRestantes = Math.floor((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
      toast.error(t.emergency.toastExpiredTitle, {
        description: t.emergency.toastExpiredDesc,
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    if (diasRestantes <= 30) {
      toast.warning(t.emergency.toastExpiringTitle, {
        description: t.emergency.toastExpiringDesc(diasRestantes),
        duration: 6000
      });
    }

    // Aqui seria onde salvamos no DataService
    toast.success(t.emergency.toastSuccessTitle, {
      description: t.emergency.toastSuccessDesc,
      icon: <Check className="w-5 h-5" />
    });

    onVoltar();
  };

  // Formatar data para exibição
  const formatarData = (data: string) => {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Calcular status do DPA
  const getStatusDPA = () => {
    if (!validadeDPA) return { texto: t.emergency.statusNotFilled, cor: '#9CA3AF' };
    
    const dataValidade = new Date(validadeDPA);
    const hoje = new Date();
    const diasRestantes = Math.floor((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
      return { texto: t.emergency.statusExpired, cor: temaAtual === 'escuro' ? '#FCA5A5' : '#DC2626' };
    } else if (diasRestantes <= 30) {
      return { texto: t.emergency.statusExpiringSoon(diasRestantes), cor: temaAtual === 'escuro' ? '#FDE68A' : '#D97706' };
    } else if (diasRestantes <= 90) {
      return { texto: t.emergency.statusExpiringMonths(Math.floor(diasRestantes / 30)), cor: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' };
    } else {
      return { texto: t.emergency.statusValid, cor: temaAtual === 'escuro' ? '#86EFAC' : '#059669' };
    }
  };

  const statusDPA = getStatusDPA();

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto pb-20" 
      style={{ backgroundColor: temaAtual === 'escuro' ? '#1A1A1A' : '#FDF8EE' }}
    >
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-10 text-white" 
        style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
      >
        <div className="flex items-center gap-4 px-6 pt-12 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoltar}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl">{t.emergency.title}</h2>
            <p className="text-sm opacity-90">{t.emergency.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Informação sobre DPA - VERSÃO CONCISA */}
        <Card 
          className="p-5 border-2" 
          style={temaAtual === 'escuro' ? {
            backgroundColor: '#2A2A2A',
            borderColor: 'rgba(167, 139, 202, 0.3)'
          } : {
            backgroundColor: '#FFFFFF',
            borderColor: '#E9D5FF'
          }}
        >
          <div className="flex items-start gap-3">
            <FileHeart 
              className="w-6 h-6 flex-shrink-0 mt-0.5" 
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} 
            />
            <div>
              <h3 
                className="mb-2 text-sm"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {t.emergency.aboutDPA}
              </h3>
              <p 
                className="text-xs leading-relaxed"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                {t.emergency.aboutDPAText}
              </p>
            </div>
          </div>
        </Card>

        {/* Card: Formulário - Validade do DPA */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : {}}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} 
            />
            <h3 
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#374151' }}
            >
              {t.emergency.docValidity}
            </h3>
          </div>

          <div className="space-y-5">
            {/* Campo: Validade DPA */}
            <div>
              <label 
                className="block text-sm mb-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#111827' }}
              >
                {t.emergency.validityLabel} <span style={{ color: '#FCA5A5' }}>*</span>
              </label>
              <input
                type="date"
                value={validadeDPA}
                onChange={(e) => setValidadeDPA(e.target.value)}
                className="w-full h-14 px-4 pr-12 border-2 rounded-lg [&::-webkit-calendar-picker-indicator]:opacity-0"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: '#1F1F1F',
                  borderColor: 'rgba(167, 139, 202, 0.3)',
                  color: '#FFFFFF',
                  outline: 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D8CEE8',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : '#D8CEE8';
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.emergency.validityHelp}
              </p>

              {/* Status do DPA */}
              {validadeDPA && (
                <div 
                  className="mt-3 px-3 py-2 rounded-lg flex items-center gap-2"
                  style={{
                    backgroundColor: temaAtual === 'escuro' 
                      ? 'rgba(167, 139, 202, 0.1)' 
                      : 'rgba(74, 44, 96, 0.05)',
                    borderLeft: `3px solid ${statusDPA.cor}`
                  }}
                >
                  <Activity className="w-4 h-4" style={{ color: statusDPA.cor }} />
                  <span className="text-sm" style={{ color: statusDPA.cor }}>
                    {statusDPA.texto}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Card: Formulário - Contatos de Emergência */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : {}}
        >
          <div className="flex items-center gap-2 mb-4">
            <Phone 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} 
            />
            <h3 
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#374151' }}
            >
              {t.emergency.emergencyContacts}
            </h3>
          </div>

          <div className="space-y-5">
            {/* Campo: Contato de Emergência */}
            <div>
              <label 
                className="block text-sm mb-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#111827' }}
              >
                {t.emergency.contactLabel} <span style={{ color: '#FCA5A5' }}>*</span>
              </label>
              <input
                type="text"
                value={contatoEmergencia}
                onChange={(e) => setContatoEmergencia(e.target.value)}
                placeholder={t.emergency.contactPlaceholder}
                className="w-full h-14 px-4 border-2 rounded-lg"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: '#1F1F1F',
                  borderColor: 'rgba(167, 139, 202, 0.3)',
                  color: '#FFFFFF',
                  outline: 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D8CEE8',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : '#D8CEE8';
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.emergency.contactHelp}
              </p>
            </div>

            {/* Campo: Telefone de Emergência */}
            <div>
              <label 
                className="block text-sm mb-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#111827' }}
              >
                {t.emergency.phoneLabel} <span style={{ color: '#FCA5A5' }}>*</span>
              </label>
              <input
                type="tel"
                value={telefoneEmergencia}
                onChange={(e) => setTelefoneEmergencia(e.target.value)}
                placeholder={t.emergency.phonePlaceholder}
                className="w-full h-14 px-4 border-2 rounded-lg"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: '#1F1F1F',
                  borderColor: 'rgba(167, 139, 202, 0.3)',
                  color: '#FFFFFF',
                  outline: 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D8CEE8',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : '#D8CEE8';
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.emergency.phoneHelp}
              </p>
            </div>
          </div>
        </Card>

        {/* Card: Informações Médicas Adicionais */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : {}}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} 
            />
            <h3 
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#374151' }}
            >
              {t.emergency.additionalMedicalInfo}
            </h3>
          </div>

          <div>
            {/* Campo: Alergias */}
            <div>
              <label 
                className="block text-sm mb-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#111827' }}
              >
                {t.emergency.allergiesLabel}
              </label>
              <textarea
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
                placeholder={t.emergency.allergiesPlaceholder}
                rows={4}
                className="w-full px-4 py-3 border-2 rounded-lg resize-none"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: '#1F1F1F',
                  borderColor: 'rgba(167, 139, 202, 0.3)',
                  color: '#FFFFFF',
                  outline: 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D8CEE8',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : '#D8CEE8';
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.emergency.allergiesHelp}
              </p>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : {}}
        >
          <h3 
            className="mb-4"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
          >
            {t.emergency.summary}
          </h3>
          <div className="space-y-3 text-sm">
            <div 
              className="flex justify-between items-center py-3 border-b"
              style={{ borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB' }}
            >
              <span style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>{t.emergency.dpaValidity}</span>
              <span 
                className="font-medium"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {formatarData(validadeDPA)}
              </span>
            </div>
            <div 
              className="flex justify-between items-center py-3 border-b"
              style={{ borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB' }}
            >
              <span style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>{t.emergency.status}</span>
              <span 
                className="font-medium"
                style={{ color: statusDPA.cor }}
              >
                {statusDPA.texto}
              </span>
            </div>
            <div 
              className="flex justify-between items-center py-3 border-b"
              style={{ borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB' }}
            >
              <span style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>{t.emergency.emergencyContact}</span>
              <span 
                className="font-medium"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {contatoEmergencia || '—'}
              </span>
            </div>
            <div 
              className="flex justify-between items-center py-3 border-b"
              style={{ borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB' }}
            >
              <span style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>{t.emergency.phoneNumber}</span>
              <span 
                className="font-medium"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {telefoneEmergencia || '—'}
              </span>
            </div>
            {alergias && (
              <div className="py-3">
                <span 
                  className="block mb-2"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.emergency.allergies}
                </span>
                <div 
                  className="border rounded-lg p-3"
                  style={temaAtual === 'escuro' ? {
                    backgroundColor: 'rgba(251, 191, 36, 0.15)',
                    borderColor: 'rgba(251, 191, 36, 0.3)'
                  } : {
                    backgroundColor: '#FEF3C7',
                    borderColor: '#FDE68A'
                  }}
                >
                  <p 
                    className="text-sm"
                    style={{ color: temaAtual === 'escuro' ? '#FDE68A' : '#92400E' }}
                  >
                    {alergias}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Botão Salvar */}
        <button 
          className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer border-0"
          style={{ 
            backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
            color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
            border: 'none',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#B5CC3D' : '#5A3C70';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#C8E046' : '#4A2C60';
          }}
          onClick={handleSalvar}
        >
          {t.emergency.saveButton}
        </button>
      </div>
    </div>
  );
}