import { cn } from "@/utils/helpers";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  const baseStyles = "rounded-lg flex-row items-center justify-center";

  const variants = {
    primary: "bg-primary-500 active:bg-primary-600",
    secondary: "bg-secondary-500 active:bg-secondary-600",
    outline: "border-2 border-primary-500 bg-transparent active:bg-primary-50",
  };

  const sizes = {
    sm: "px-3 py-2 min-h-[32px]",
    md: "px-4 py-3 min-h-[44px]",
    lg: "px-6 py-4 min-h-[52px]",
  };

  const textVariants = {
    primary: "text-white font-semibold",
    secondary: "text-white font-semibold",
    outline: "text-primary-500 font-semibold",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-50",
        className
      )}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? "#3b82f6" : "#ffffff"}
          className="mr-2"
        />
      )}
      <Text className={cn(textVariants[variant])}>{title}</Text>
    </TouchableOpacity>
  );
}
