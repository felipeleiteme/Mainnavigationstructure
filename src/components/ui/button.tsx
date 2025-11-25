import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-95",
  {
    variants: {
      variant: {
        // Variante padrão: Roxo brandbook (#4A2C60)
        default: 
          "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md border-0",
        
        // Variante secundária: Verde-lima brandbook (#C8E046) com texto roxo
        secondary:
          "bg-secondary-500 text-primary-500 hover:bg-secondary-600 active:bg-secondary-700 shadow-sm hover:shadow-md border-0",
        
        // Variante destrutiva: Vermelho erro
        destructive:
          "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow-md border-0",
        
        // Variante outline: Borda roxo com hover roxo claro
        outline:
          "border-2 border-primary-300 bg-white text-primary-700 hover:bg-primary-50 active:bg-primary-100 shadow-sm",
        
        // Variante ghost: Transparente com hover cinza
        ghost:
          "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700",
        
        // Variante link: Apenas texto roxo com underline
        link: 
          "text-primary-500 underline-offset-4 hover:underline active:text-primary-700",
      },
      size: {
        // Tamanho padrão: 56px (h-14) - otimizado para toque mobile
        default: "h-14 px-6 text-base",
        
        // Tamanho pequeno: 40px (h-10)
        sm: "h-10 px-4 text-sm",
        
        // Tamanho grande: 64px (h-16)
        lg: "h-16 px-8 text-lg",
        
        // Tamanho ícone: 56px × 56px (quadrado)
        icon: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
