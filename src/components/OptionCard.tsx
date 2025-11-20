import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface OptionCardProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect?: boolean;
  isReviewMode?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const OptionCard = ({
  option,
  index,
  isSelected,
  isCorrect,
  isReviewMode,
  onClick,
  disabled
}: OptionCardProps) => {
  const optionLabels = ['A', 'B', 'C', 'D'];

  const getCardStyles = () => {
    if (isReviewMode) {
      if (isCorrect && isSelected) {
        return "border-success bg-success/10 ring-2 ring-success";
      }
      if (isCorrect && !isSelected) {
        return "border-success bg-success/5";
      }
      if (!isCorrect && isSelected) {
        return "border-destructive bg-destructive/10 ring-2 ring-destructive";
      }
    }
    
    if (isSelected) {
      return "border-primary bg-primary/10 ring-2 ring-primary";
    }
    
    return "border-border hover:border-primary/50 hover:bg-muted";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isReviewMode}
      className={cn(
        "w-full p-4 rounded-xl border-2 transition-all duration-200",
        "text-left flex items-center gap-4 group",
        "disabled:cursor-not-allowed disabled:opacity-60",
        !disabled && !isReviewMode && "hover:scale-[1.02] active:scale-[0.98]",
        getCardStyles()
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-lg font-semibold",
          "flex items-center justify-center transition-colors",
          isReviewMode && isCorrect
            ? "bg-success text-success-foreground"
            : isReviewMode && isSelected && !isCorrect
            ? "bg-destructive text-destructive-foreground"
            : isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground group-hover:bg-primary/20"
        )}
      >
        {optionLabels[index]}
      </div>
      
      <span className="flex-1 text-foreground font-medium">{option}</span>
      
      {isReviewMode && (
        <div className="flex-shrink-0">
          {isCorrect ? (
            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
              <Check className="w-4 h-4 text-success-foreground" />
            </div>
          ) : isSelected && !isCorrect ? (
            <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
              <X className="w-4 h-4 text-destructive-foreground" />
            </div>
          ) : null}
        </div>
      )}
    </button>
  );
};
