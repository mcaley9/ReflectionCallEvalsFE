import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4"
};

export function StatusIndicator({ 
  status, 
  size = "md", 
  className 
}: StatusIndicatorProps) {
  return (
    <div 
      className={cn(
        "rounded-full",
        status ? "bg-green-500" : "bg-red-500",
        sizeClasses[size],
        className
      )}
    />
  );
}