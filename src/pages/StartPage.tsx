// File: src/pages/StartPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { quizDifficulties, quizTopics } from "@/data/quizData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * NOTE about the logo source:
 * - Your generated logo file (uploaded earlier) is located at:
 *   /mnt/data/A_vector-based_digital_vector_graphic_logo_for_an_.png
 *
 * - The runtime that runs your app will transform this local path into a URL when needed.
 *   If you instead want to use the logo from `public/` (recommended in production), copy the file
 *   into `public/quizio-logo.png` and replace LOGO_SRC with "/quizio-logo.png".
 */
const LOGO_SRC = "/public/quizio.png";

const StartPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            {/* Logo on unauthenticated screen */}
            <div className="mx-auto mb-2 w-20 h-20">
              
              <img
                src={LOGO_SRC}
                alt="Quizio Logo"
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            <h1 className="text-4xl font-bold mb-4"></h1>
            <p className="text-xl text-muted-foreground mb-8">Test your knowledge across multiple topics!</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>Sign in to start your quiz journey and compete on the leaderboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/auth')} className="w-full" size="lg">
                <LogIn className="w-5 h-5 mr-2" />
                Sign In to Get Started
              </Button>
            </CardContent>
          </Card>

          <div className="mt-4 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            {/* Top-left logo + brand name */}
            <a href="/" className="flex items-center gap-3">
              <img
                src={LOGO_SRC}
                alt="Quizio Logo"
                className="w-10 h-10 object-contain"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <h2 className="text-xl font-bold">Quizio</h2>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Pass avatarUrl if available (UserMenu can use it as a prop) */}
            <UserMenu username={profile?.username || 'User'} /* avatarUrl={profile?.avatar_url ?? null} */ />
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Choose Your Challenge</h1>
          <p className="text-xl text-muted-foreground">Select difficulty and topic to begin!</p>
        </div>

        {/* Option A: Horizontal scrollable pills for mobile */}
        <Tabs defaultValue="math" className="mb-8">
          {/* flex + overflow-x-auto allows swipe on mobile */}
          <TabsList className="flex w-full gap-3 mb-6 overflow-x-auto no-scrollbar px-6">
            {quizTopics.map((topic) => (
              <TabsTrigger
                key={topic.id}
                value={topic.id}
                className="tabs-trigger-pill flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-md"
              >
                <span className="mr-2"></span>
                {topic.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {quizTopics.map((topic) => (
            <TabsContent key={topic.id} value={topic.id}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quizDifficulties.map((difficulty) => (
                  <Card key={difficulty.id} className="difficulty-card hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="text-4xl mb-2"></div>
                      <CardTitle>{difficulty.name}</CardTitle>
                      <CardDescription>{difficulty.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => navigate(`/quiz?difficulty=${difficulty.id}&topic=${topic.id}`)}
                        className="w-full"
                      >
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default StartPage;
