import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getQuestionsByDifficulty } from "@/data/quizData";
import { UserAnswer } from "./QuizPage";
import { Trophy, RotateCcw, Home } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const ResultPage = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('normal');
  const [topic, setTopic] = useState('math');
  const { playComplete } = useSoundEffects();

  useEffect(() => {
    const savedScore = sessionStorage.getItem("quizScore");
    const savedDifficulty = sessionStorage.getItem("quizDifficulty");
    const savedTopic = sessionStorage.getItem("quizTopic");
    if (!savedScore) {
      navigate("/");
      return;
    }
    setScore(parseInt(savedScore));
    setDifficulty(savedDifficulty || 'normal');
    setTopic(savedTopic || 'math');
    playComplete();
  }, [navigate, playComplete]);

  const questions = getQuestionsByDifficulty(difficulty, topic);
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <Trophy className="w-24 h-24 mx-auto mb-8 text-primary" />
        <h1 className="text-5xl font-bold mb-4">Quiz Complete!</h1>
        <div className="text-7xl font-bold mb-8">{score}/{questions.length}</div>
        <div className="text-3xl mb-8">{percentage}%</div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => { sessionStorage.clear(); navigate(`/quiz?difficulty=${difficulty}&topic=${topic}`); }}>
            <RotateCcw className="w-5 h-5 mr-2" />Try Again
          </Button>
          <Button onClick={() => { sessionStorage.clear(); navigate("/"); }} variant="outline">
            <Home className="w-5 h-5 mr-2" />Home
          </Button>
          <Button onClick={() => navigate('/leaderboard')} variant="outline">
            <Trophy className="w-5 h-5 mr-2" />Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
