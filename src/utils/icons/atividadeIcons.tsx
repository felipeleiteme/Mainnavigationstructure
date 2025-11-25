import { Home, Sprout, BookOpen, Building2, Phone, Mail, Briefcase, Clock } from 'lucide-react';

export type TipoAtividade = 
  | 'casa-em-casa'
  | 'revisita'
  | 'estudo-biblico'
  | 'testemunho-publico'
  | 'telefone'
  | 'carta'
  | 'informal'
  | 'credito';

export function getAtividadeIcon(tipo: string, className?: string) {
  const iconProps = { className: className || 'w-6 h-6' };
  
  switch (tipo) {
    case 'casa-em-casa':
      return <Home {...iconProps} />;
    case 'revisita':
      return <Sprout {...iconProps} />;
    case 'estudo-biblico':
      return <BookOpen {...iconProps} />;
    case 'testemunho-publico':
      return <Building2 {...iconProps} />;
    case 'telefone':
      return <Phone {...iconProps} />;
    case 'carta':
      return <Mail {...iconProps} />;
    case 'informal':
      return <Briefcase {...iconProps} />;
    case 'credito':
      return <Clock {...iconProps} />;
    default:
      return <Clock {...iconProps} />;
  }
}
