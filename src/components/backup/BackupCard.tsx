import { Download, Upload, Lightbulb, Check, AlertCircle, FileWarning } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useEffect, useRef } from 'react';
import { DataService } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';

interface BackupCardProps {
  onSyncComplete?: () => void;
}

export default function BackupCard({ onSyncComplete }: BackupCardProps) {
  const [ultimaSync, setUltimaSync] = useState<string>('Nunca sincronizado');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    atualizarTextoSync();
    
    // Atualizar a cada minuto
    const interval = setInterval(() => {
      atualizarTextoSync();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const atualizarTextoSync = () => {
    const texto = DataService.getTextoUltimaSync();
    setUltimaSync(texto);
  };

  const handleBaixarBackup = async () => {
    try {
      setIsProcessing(true);
      
      DataService.baixarBackup();
      
      toast.success('Backup criado!', {
        description: 'Arquivo salvo na pasta de Downloads',
        icon: <Check className="w-5 h-5" />
      });
      
      atualizarTextoSync();
      onSyncComplete?.();
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast.error('Erro ao criar backup', {
        description: 'Não foi possível gerar o arquivo. Tente novamente.',
        icon: <AlertCircle className="w-5 h-5" />
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestaurarBackup = () => {
    inputFileRef.current?.click();
  };

  const handleArquivoSelecionado = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    // Validar extensão
    if (!arquivo.name.endsWith('.json')) {
      toast.error('Arquivo inválido', {
        description: 'Por favor, selecione um arquivo JSON de backup do Mynis',
        icon: <FileWarning className="w-5 h-5" />
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      await DataService.importarBackup(arquivo);
      
      toast.success('Backup restaurado com sucesso!', {
        description: 'Todos os seus dados foram restaurados',
        icon: <Check className="w-5 h-5" />
      });
      
      atualizarTextoSync();
      onSyncComplete?.();
      
      // Recarregar a página após 1 segundo para garantir que tudo seja atualizado
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error('Erro ao restaurar backup:', error);
      
      if (error.message === 'Restauração cancelada pelo usuário') {
        // Usuário cancelou, não mostrar erro
        return;
      }
      
      toast.error('Erro ao restaurar backup', {
        description: error.message || 'Não foi possível restaurar os dados. Verifique o arquivo.',
        icon: <AlertCircle className="w-5 h-5" />
      });
    } finally {
      setIsProcessing(false);
      // Limpar input para permitir selecionar o mesmo arquivo novamente
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Última sincronização: {ultimaSync}</span>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Seus dados estão seguros na nuvem
      </p>

      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleBaixarBackup}
          disabled={isProcessing}
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar Backup
        </Button>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleRestaurarBackup}
          disabled={isProcessing}
        >
          <Upload className="w-4 h-4 mr-2" />
          Restaurar
        </Button>
      </div>

      {/* Input file oculto */}
      <input
        ref={inputFileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleArquivoSelecionado}
      />

      <div className="mt-4 p-3 rounded-lg border border-blue-200 bg-blue-50">
        <p className="text-xs text-blue-900 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span><strong>Dica:</strong> Salve o backup no Google Drive ou outro serviço de nuvem para acessar em qualquer dispositivo!</span>
        </p>
      </div>
    </div>
  );
}