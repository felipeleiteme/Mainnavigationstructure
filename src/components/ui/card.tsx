import * as React from "react";

import { cn } from "./utils";

/**
 * Card - Componente base para containers de conteúdo
 * 
 * Design System Mynis:
 * - Background: Branco (#ffffff) para contraste sobre fundo creme (#FDF8EE)
 * - Border: Roxo muito claro (border-primary-100) para definição sutil
 * - Border Radius: rounded-xl (12px) - padrão brandbook
 * - Shadow: shadow-sm para elevação leve
 * - Text: text-gray-900 para máxima legibilidade
 * - Micro-interações: active:scale-95 para feedback tátil em cards clicáveis
 * - Transitions: transition-all duration-200 para suavidade
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-white text-gray-900 rounded-xl border border-primary-100 shadow-sm transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardHeader - Cabeçalho do card com grid layout
 * 
 * Grid automático para título + descrição + ação opcional
 * Padding: px-6 pt-6 (24px horizontal, 24px topo) - Grid 8pt
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardTitle - Título do card
 * 
 * Usa h4 semântico com leading-none para controle preciso
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none text-primary-700", className)}
      {...props}
    />
  );
}

/**
 * CardDescription - Descrição/subtítulo do card
 * 
 * Texto secundário com cor cinza para hierarquia visual
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-gray-600", className)}
      {...props}
    />
  );
}

/**
 * CardAction - Área para ações/botões no header
 * 
 * Posicionado automaticamente no grid à direita do título
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardContent - Conteúdo principal do card
 * 
 * Padding horizontal consistente (px-6)
 * Padding bottom automático no último filho
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

/**
 * CardFooter - Rodapé do card
 * 
 * Flexbox horizontal para ações/botões
 * Padding: px-6 pb-6 (24px) - Grid 8pt
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2 px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};