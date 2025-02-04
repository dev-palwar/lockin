import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "border-input",
        outline: "border border-gray-300 focus-visible:ring-blue-500",
        filled: "bg-gray-100 border-gray-300 focus-visible:ring-blue-500",
        ghost:
          "border-transparent bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-0",
      },
      size: {
        default: "h-9 text-base px-3 py-1",
        sm: "h-8 text-sm px-2 py-1",
        lg: "h-11 text-lg px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ✅ Omit 'size' from input attributes to avoid type conflict
interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
