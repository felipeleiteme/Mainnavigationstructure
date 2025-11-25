import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

/**
 * Badge - Componente para labels e status
 * 
 * Design System Mynis:
 * - Variantes semânticas baseadas em estados reais do app
 * - Cores com contraste WCAG AA (texto -700/-800 sobre fundo -50/-100)
 * - Border sutil (-200) para definição
 * - Rounded-md (8px) para suavidade
 * - Transitions para interatividade
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-200",
  {
    variants: {
      variant: {
        // ========================================
        // VARIANTES BASE
        // ========================================
        
        // Padrão: Roxo brandbook
        default:
          "bg-primary-500 text-white border-primary-500",
        
        // Secundária: Verde-lima brandbook
        secondary:
          "bg-secondary-500 text-primary-500 border-secondary-500",
        
        // Destrutiva: Vermelho erro
        destructive:
          "bg-red-500 text-white border-red-500",
        
        // Outline: Borda com fundo branco
        outline:
          "bg-white text-gray-700 border-gray-300",
        
        // ========================================
        // STATUS DE REVISITAS (Campo Tab)
        // ========================================
        
        // Nova: Verde - pessoa recém-conhecida
        nova:
          "bg-green-50 text-green-800 border-green-200",
        
        // Quente: Laranja - pessoa muito interessada
        quente:
          "bg-orange-50 text-orange-800 border-orange-200",
        
        // Comércio: Azul - testemunho em estabelecimento comercial
        comercio:
          "bg-blue-50 text-blue-800 border-blue-200",
        
        // Descanso: Cinza - pessoa que pediu pausa
        descanso:
          "bg-gray-50 text-gray-700 border-gray-200",
        
        // Interesse: Roxo-rosa - pessoa com interesse em estudar
        interesse:
          "bg-purple-50 text-purple-800 border-purple-200",
        
        // ========================================
        // STATUS DE ESTUDOS BÍBLICOS (Estudos Tab)
        // ========================================
        
        // Iniciando: Verde - primeiras lições (1-3)
        iniciando:
          "bg-green-50 text-green-800 border-green-200",
        
        // Progredindo: Azul - meio do curso (4-7)
        progredindo:
          "bg-blue-50 text-blue-800 border-blue-200",
        
        // Dúvidas: Amarelo - estudante com dificuldades
        duvidas:
          "bg-yellow-50 text-yellow-800 border-yellow-200",
        
        // Avançado: Roxo - perto de concluir (8-10)
        avancado:
          "bg-purple-50 text-purple-800 border-purple-200",
        
        // Concluído: Verde escuro - curso finalizado
        concluido:
          "bg-emerald-50 text-emerald-800 border-emerald-200",
        
        // Pausado: Cinza - estudo temporariamente parado
        pausado:
          "bg-gray-50 text-gray-700 border-gray-200",
        
        // ========================================
        // STATUS ADICIONAIS (Geral)
        // ========================================
        
        // Ativo: Verde - item ativo/em andamento
        ativo:
          "bg-green-50 text-green-800 border-green-200",
        
        // Inativo: Cinza - item inativo/arquivado
        inativo:
          "bg-gray-50 text-gray-700 border-gray-200",
        
        // Pendente: Amarelo - ação pendente
        pendente:
          "bg-yellow-50 text-yellow-800 border-yellow-200",
        
        // Urgente: Vermelho - ação urgente
        urgente:
          "bg-red-50 text-red-800 border-red-200",
        
        // Sucesso: Verde - ação bem-sucedida
        sucesso:
          "bg-green-50 text-green-800 border-green-200",
        
        // Alerta: Laranja - atenção necessária
        alerta:
          "bg-orange-50 text-orange-800 border-orange-200",
        
        // Info: Azul - informação neutra
        info:
          "bg-blue-50 text-blue-800 border-blue-200",
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
