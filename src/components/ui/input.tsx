import * as React from "react";

import { cn } from "./utils";

/**
 * Input - Componente de entrada de texto
 * 
 * Design System Mynis (Brandbook):
 * - Altura: h-14 (56px) - otimizado para toque mobile
 * - Border: border-2 (2px) para visibilidade
 * - Border Color: border-gray-300 (padrão), focus:border-primary-500 (ativo)
 * - Border Radius: rounded-xl (12px) - padrão brandbook
 * - Focus Ring: ring-2 ring-primary-500/20 - sutil e roxo
 * - Background: bg-white para contraste sobre fundo creme
 * - Text: text-base (16px) - mínimo mobile brandbook
 * - Placeholder: text-gray-400 - contraste adequado
 * - Disabled: opacity-50 + bg-gray-100 - feedback visual claro
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - Mobile first (h-14 = 56px)
        "flex h-14 w-full rounded-xl border-2 border-gray-300 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400",
        // Focus states - Roxo brandbook
        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
        // Disabled states
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
        // Transitions - Suavidade
        "transition-all duration-200 outline-none",
        // File input styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-700",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
