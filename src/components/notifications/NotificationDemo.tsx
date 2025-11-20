import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { MynisNotifications } from '../../utils/notifications';

export default function NotificationDemo() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-blue-600" />
        <h3>Testar Notificações</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.lembreteEstudo('João Silva', '14h')}
        >
          Lembrete Estudo
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.lembreteMinisterio('Manhã')}
        >
          Cronograma Ideal
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.lembreteLeituraBiblia('Lucas 10')}
        >
          Leitura Bíblia
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.lembreteRelatorio(0)}
        >
          Relatório
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.estudoEsquecido('Maria', 15)}
        >
          Estudo Esquecido
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.pausaInteligente()}
        >
          Pausa Campo
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.versiculoEncorajador(
            'Não desista de fazer o que é excelente',
            'Gálatas 6:9'
          )}
        >
          Versículo
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.celebracaoMeta('ofensiva', 30)}
        >
          Celebração
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.encorajamentoMeta(15, 5)}
        >
          Encorajamento
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.dpaVencendo(25)}
        >
          DPA Vencendo
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.boasVindasDiaria('Felipe', new Date().getHours())}
        >
          Boas-vindas
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => MynisNotifications.aniversarioBatismo(14)}
        >
          Aniversário
        </Button>
      </div>

      <p className="text-xs text-gray-600 mt-4">
        Clique nos botões acima para testar diferentes tipos de notificações
      </p>
    </Card>
  );
}
