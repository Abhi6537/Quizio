import { QuizQuestion } from "@/data/quizData";
import { OptionCard } from "./OptionCard";

interface QuestionProps {
  question: QuizQuestion;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  isReviewMode?: boolean;
  userAnswer?: number | null;
}

export const Question = ({
  question,
  selectedOption,
  onSelectOption,
  isReviewMode = false,
  userAnswer
}: QuestionProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
        <h2 className="text-2xl font-bold text-foreground leading-relaxed">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <OptionCard
            key={index}
            option={option}
            index={index}
            isSelected={isReviewMode ? userAnswer === index : selectedOption === index}
            isCorrect={isReviewMode ? index === question.correctAnswer : undefined}
            isReviewMode={isReviewMode}
            onClick={() => !isReviewMode && onSelectOption(index)}
            disabled={isReviewMode}
          />
        ))}
      </div>

      {isReviewMode && question.explanation && (
        <div className="bg-muted rounded-xl p-5 border-l-4 border-primary animate-slide-up">
          <p className="text-sm font-semibold text-primary mb-2">Explanation:</p>
          <p className="text-foreground">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
