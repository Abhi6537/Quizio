import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { quizDifficulties, quizTopics } from '@/data/quizData';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  total_questions: number;
  time_taken: number;
  completed_at: string;
  percentage: number;
}

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedTopic]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    
    let query = supabase
      .from('quiz_results')
      .select(`
        id,
        score,
        total_questions,
        time_taken,
        completed_at,
        topic,
        profiles!inner(username)
      `)
      .order('score', { ascending: false })
      .order('time_taken', { ascending: true })
      .limit(10);

    if (selectedTopic !== 'all') {
      query = query.eq('topic', selectedTopic);
    }

    const { data, error } = await query;

    if (!error && data) {
      setLeaderboard(data.map((entry: any) => ({
        id: entry.id,
        username: entry.profiles.username,
        score: entry.score,
        total_questions: entry.total_questions,
        time_taken: entry.time_taken,
        completed_at: entry.completed_at,
        percentage: Math.round((entry.score / entry.total_questions) * 100),
      })));
    }

    setLoading(false);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 text-center font-semibold">{index + 1}</span>;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <ThemeToggle />
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl font-bold">Leaderboard</CardTitle>
            <CardDescription>Top performers across all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Tabs value={selectedTopic} onValueChange={setSelectedTopic} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All Topics</TabsTrigger>
                  {quizTopics.map((topic) => (
                    <TabsTrigger key={topic.id} value={topic.id}>
                      <span className="mr-1">{topic.icon}</span>
                      {topic.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-2">
                {leaderboard.length > 0 ? (
                  leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <div className="flex-shrink-0">{getRankIcon(index)}</div>
                      <div className="flex-1">
                        <p className="font-semibold">{entry.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.score}/{entry.total_questions} correct ({entry.percentage}%)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{entry.score} pts</p>
                        <p className="text-sm text-muted-foreground">{formatTime(entry.time_taken)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No results yet. Be the first to complete this quiz!
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;
