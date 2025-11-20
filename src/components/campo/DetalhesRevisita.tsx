import { X, Navigation, MapPin, Clock, Phone, Edit, GraduationCap } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface Revisita {
  id: string;
  nome: string;
  endereco: string;
  tipo: string;
  status: string;
  disponibilidade: string;
  ultimaVisita: string;
  tags: string[];
  emEstudo: boolean;
  telefone?: string;
  observacoes?: string;
  historico?: Array<{ data: string; obs: string }>;
}

interface DetalhesRevisitaProps {
  revisita: Revisita;
  onClose: () => void;
  onIniciarEstudo: (revisita: Revisita) => void;
}

export default function DetalhesRevisita({ revisita, onClose, onIniciarEstudo }: DetalhesRevisitaProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl">{revisita.nome}</h2>
            <p className="text-sm text-gray-600">{revisita.endereco}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status e Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              ⚡ {revisita.status}
            </Badge>
            {revisita.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary">{tag}</Badge>
            ))}
            {revisita.emEstudo && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                📚 Em estudo
              </Badge>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <Navigation className="w-4 h-4 mr-2" />
              Navegar
            </Button>
            <Button variant="outline" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              Ligar
            </Button>
          </div>

          {/* Informações */}
          <Card className="p-4">
            <h3 className="text-sm mb-3">Informações</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Disponibilidade:</span>
                <span>{revisita.disponibilidade}</span>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Última visita:</span>
                <span>{revisita.ultimaVisita}</span>
              </div>
              {revisita.telefone && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Telefone:</span>
                    <span>{revisita.telefone}</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Observações */}
          {revisita.observacoes && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm">Observações</h3>
                <Button size="sm" variant="ghost">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-700">{revisita.observacoes}</p>
            </Card>
          )}

          {/* Histórico */}
          {revisita.historico && revisita.historico.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm mb-3">Histórico de Visitas</h3>
              <div className="space-y-2">
                {revisita.historico.map((entry, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="text-gray-600">{entry.data}</p>
                    <p className="text-gray-700">{entry.obs}</p>
                    {idx < revisita.historico!.length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Botão Iniciar Estudo */}
          {!revisita.emEstudo && (
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              onClick={() => onIniciarEstudo(revisita)}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Iniciar Estudo Bíblico
            </Button>
          )}

          {/* Outros Botões */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Editar Informações
            </Button>
            <Button variant="outline" className="flex-1 text-red-600 border-red-300">
              Arquivar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
