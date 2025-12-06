import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

/**
 * Badge - Componente para labels e status
 * 
 * Design System Mynis:
 * - Variantes semânticas baseadas em estados reais do app (revisitas, estudos)
 * - Cores com contraste WCAG AA (texto -700/-800 sobre fundo -50/-100)
 * - Border sutil (-200) para definição
 * - Rounded-lg (8px) - ideal para badges pequenos
 * - Transitions para interatividade
 * - Suporte a ícones (size-3 automático)
 * 
 * BRANDBOOK MYNIS:
 * - Primary (Roxo): #4A2C60
 * - Secondary (Verde Lima): #C8E046
 * - Cores semânticas: Verde (nova), Laranja (quente), Azul (comércio), etc.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-200",
  {
    variants: {
      variant: {
        // ========================================
        // VARIANTES BASE
        // ========================================
        
        // Padrão: Roxo brandbook (#4A2C60)
        default:
          "bg-primary-500 text-white border-primary-500 hover:bg-primary-600",
        
        // Secundária: Verde-lima brandbook (#C8E046) com texto roxo
        secondary:
          "bg-secondary-500 text-primary-500 border-secondary-500 hover:bg-secondary-600",
        
        // Destrutiva: Vermelho erro
        destructive:
          "bg-red-500 text-white border-red-500 hover:bg-red-600",
        
        // Outline: Borda com fundo branco
        outline:
          "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
        
        // ========================================
        // STATUS DE REVISITAS (Campo Tab)
        // ========================================
        
        // Nova: Verde - pessoa recém-conhecida, primeiro contato
        nova:
          "bg-green-50 text-green-800 border-green-200 hover:bg-green-100",
        
        // Quente: Laranja - pessoa muito interessada, alta prioridade
        quente:
          "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100",
        
        // Comércio: Azul - testemunho em estabelecimento comercial
        comercio:
          "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100",
        
        // Descanso: Cinza - pessoa que pediu pausa temporária
        descanso:
          "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
        
        // Interesse: Roxo-rosa - pessoa com interesse explícito em estudar
        interesse:
          "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100",
        
        // ========================================
        // STATUS DE ESTUDOS BÍBLICOS (Estudos Tab)
        // ========================================
        
        // Iniciando: Verde - primeiras lições (1-3), novo estudante
        iniciando:
          "bg-green-50 text-green-800 border-green-200 hover:bg-green-100",
        
        // Progredindo: Azul - meio do curso (4-7), avançando bem
        progredindo:
          "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100",
        
        // Dúvidas: Amarelo - estudante com dificuldades, precisa atenção
        duvidas:
          "bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
        
        // Avançado: Roxo - perto de concluir (8-10), próximo do batismo
        avancado:
          "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100",
        
        // Concluído: Verde escuro - curso finalizado com sucesso
        concluido:
          "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
        
        // Pausado: Cinza - estudo temporariamente parado
        pausado:
          "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
        
        // ========================================
        // STATUS ADICIONAIS (Geral)
        // ========================================
        
        // Ativo: Verde - item ativo/em andamento
        ativo:
          "bg-green-50 text-green-800 border-green-200 hover:bg-green-100",
        
        // Inativo: Cinza - item inativo/arquivado
        inativo:
          "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
        
        // Pendente: Amarelo - ação pendente, aguardando
        pendente:
          "bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
        
        // Urgente: Vermelho - ação urgente, requer atenção imediata
        urgente:
          "bg-red-50 text-red-800 border-red-200 hover:bg-red-100",
        
        // Sucesso: Verde - ação bem-sucedida, feedback positivo
        sucesso:
          "bg-green-50 text-green-800 border-green-200 hover:bg-green-100",
        
        // Alerta: Laranja - atenção necessária, cuidado
        alerta:
          "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100",
        
        // Info: Azul - informação neutra, contextual
        info:
          "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
