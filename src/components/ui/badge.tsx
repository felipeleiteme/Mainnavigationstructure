import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white border-primary-500",
        secondary:
          "bg-secondary-500 text-primary-500 border-secondary-500",
        destructive:
          "bg-red-500 text-white border-red-500",
        outline:
          "bg-white text-gray-700 border-gray-300",
        // Status semânticos do Mynis
        nova:
          "bg-green-50 text-green-700 border-green-200",
        quente:
          "bg-orange-50 text-orange-700 border-orange-200",
        comercio:
          "bg-blue-50 text-blue-700 border-blue-200",
        descanso:
          "bg-gray-50 text-gray-700 border-gray-200",
        // Status de estudos
        iniciando:
          "bg-green-50 text-green-700 border-green-200",
        progredindo:
          "bg-blue-50 text-blue-700 border-blue-200",
        duvidas:
          "bg-yellow-50 text-yellow-700 border-yellow-200",
        avancado:
          "bg-purple-50 text-purple-700 border-purple-200",
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