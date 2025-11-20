import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Question } from "@/components/Question";
import { ProgressBar } from "@/components/ProgressBar";
import { Timer } from "@/components/Timer";
import { getQuestionsByDifficulty } from "@/data/quizData";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
}

const QuizPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty') || 'normal';
  const topic = searchParams.get('topic') || 'math';
  const questions = getQuestionsByDifficulty(difficulty, topic);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [startTime] = useState(Date.now());
  const [user, setUser] = useState<any>(null);

  const { playCorrect, playIncorrect, playClick } = useSoundEffects();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const existingAnswer = userAnswers.find(answer => answer.questionId === currentQuestion.id);
    setSelectedOption(existingAnswer?.selectedOption ?? null);
  }, [currentQuestionIndex, userAnswers, currentQuestion.id]);

  const handleSelectOption = (index: number) => {
    if (soundEnabled) playClick();
    setSelectedOption(index);
    const updatedAnswers = userAnswers.filter(answer => answer.questionId !== currentQuestion.id);
    updatedAnswers.push({ questionId: currentQuestion.id, selectedOption: index });
    setUserAnswers(updatedAnswers);
    if (soundEnabled) setTimeout(() => index === currentQuestion.correctAnswer ? playCorrect() : playIncorrect(), 100);
  };

  const handleTimeUp = () => {
    toast.error("Time's up!");
    if (selectedOption === null) {
      const updatedAnswers = [...userAnswers, { questionId: currentQuestion.id, selectedOption: -1 }];
      setUserAnswers(updatedAnswers);
    }
    setTimeout(() => isLastQuestion ? handleSubmit() : setCurrentQuestionIndex(prev => prev + 1), 1000);
  };

  const handleSubmit = async () => {
    const score = userAnswers.reduce((acc, answer) => {
      const question = questions.find(q => q.id === answer.questionId);
      return acc + (question?.correctAnswer === answer.selectedOption ? 1 : 0);
    }, 0);

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    if (user) {
      await supabase.from('quiz_results').insert({
        user_id: user.id,
        category: difficulty as any,
        topic: topic,
        score,
        total_questions: questions.length,
        time_taken: timeTaken,
      });
    }

    sessionStorage.setItem("quizScore", score.toString());
    sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    sessionStorage.setItem("quizDifficulty", difficulty);
    sessionStorage.setItem("quizTopic", topic);
    navigate("/result");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold capitalize">{topic} Quiz - {difficulty}</h1>
          <div className="flex items-center gap-2">
            <Timer duration={30} onTimeUp={handleTimeUp} />
            <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <ThemeToggle />
          </div>
        </div>
        <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
        <Question question={currentQuestion} selectedOption={selectedOption} onSelectOption={handleSelectOption} />
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setCurrentQuestionIndex(prev => prev - 1)} disabled={currentQuestionIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-2" />Previous
          </Button>
          <Button onClick={() => isLastQuestion ? handleSubmit() : setCurrentQuestionIndex(prev => prev + 1)} disabled={selectedOption === null}>
            {isLastQuestion ? "Submit" : "Next"}<ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
