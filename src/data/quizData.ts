export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'normal' | 'medium' | 'hard' | 'mixed';
  topic: 'math' | 'science' | 'sports' | 'gk';
}

export const quizDifficulties = [
  { id: 'normal', name: 'Normal', description: 'Easy questions for beginners', icon: '🌟' },
  { id: 'medium', name: 'Medium', description: 'Moderate challenge', icon: '⚡' },
  { id: 'hard', name: 'Hard', description: 'Expert level questions', icon: '🔥' },
  { id: 'mixed', name: 'Mixed', description: 'All difficulty levels', icon: '🎯' },
];

export const quizTopics = [
  { id: 'math', name: 'Mathematics', icon: '🔢' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'gk', name: 'General Knowledge', icon: '🌍' },
];

export const quizQuestions: QuizQuestion[] = [
  // Math - Normal
  { id: 1, difficulty: 'normal', topic: 'math', question: "What is 12 + 8?", options: ["18", "20", "22", "24"], correctAnswer: 1, explanation: "12 + 8 = 20" },
  { id: 2, difficulty: 'normal', topic: 'math', question: "What is 5 × 6?", options: ["25", "30", "35", "40"], correctAnswer: 1, explanation: "5 × 6 = 30" },
  { id: 3, difficulty: 'normal', topic: 'math', question: "What is 100 - 37?", options: ["63", "73", "67", "57"], correctAnswer: 0, explanation: "100 - 37 = 63" },
  
  // Math - Medium
  { id: 4, difficulty: 'medium', topic: 'math', question: "What is the square root of 144?", options: ["10", "11", "12", "13"], correctAnswer: 2, explanation: "√144 = 12" },
  { id: 5, difficulty: 'medium', topic: 'math', question: "If x + 5 = 12, what is x?", options: ["5", "6", "7", "8"], correctAnswer: 2, explanation: "x = 12 - 5 = 7" },
  
  // Math - Hard
  { id: 6, difficulty: 'hard', topic: 'math', question: "What is 15% of 240?", options: ["30", "32", "36", "40"], correctAnswer: 2, explanation: "15% of 240 = 0.15 × 240 = 36" },
  { id: 7, difficulty: 'hard', topic: 'math', question: "What is the value of π (pi) rounded to 2 decimal places?", options: ["3.12", "3.14", "3.16", "3.18"], correctAnswer: 1, explanation: "π ≈ 3.14159..." },
  
  // Science - Normal
  { id: 8, difficulty: 'normal', topic: 'science', question: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: 1, explanation: "Mars is called the Red Planet due to iron oxide on its surface." },
  { id: 9, difficulty: 'normal', topic: 'science', question: "How many legs does a spider have?", options: ["6", "8", "10", "12"], correctAnswer: 1, explanation: "Spiders have 8 legs." },
  { id: 10, difficulty: 'normal', topic: 'science', question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: 2, explanation: "Plants absorb CO2 for photosynthesis." },
  
  // Science - Medium
  { id: 11, difficulty: 'medium', topic: 'science', question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correctAnswer: 2, explanation: "Au is from the Latin 'aurum'." },
  { id: 12, difficulty: 'medium', topic: 'science', question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"], correctAnswer: 0, explanation: "Light travels at approximately 300,000 km/s." },
  
  // Science - Hard
  { id: 13, difficulty: 'hard', topic: 'science', question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"], correctAnswer: 2, explanation: "Mitochondria produce energy (ATP) for the cell." },
  { id: 14, difficulty: 'hard', topic: 'science', question: "What is the pH of pure water?", options: ["5", "6", "7", "8"], correctAnswer: 2, explanation: "Pure water has a neutral pH of 7." },
  
  // Sports - Normal
  { id: 15, difficulty: 'normal', topic: 'sports', question: "How many players are on a soccer team?", options: ["9", "10", "11", "12"], correctAnswer: 2, explanation: "Each soccer team has 11 players on the field." },
  { id: 16, difficulty: 'normal', topic: 'sports', question: "In which sport do you use a shuttlecock?", options: ["Tennis", "Badminton", "Squash", "Table Tennis"], correctAnswer: 1, explanation: "Badminton uses a shuttlecock." },
  { id: 17, difficulty: 'normal', topic: 'sports', question: "How many points is a touchdown worth in American football?", options: ["3", "5", "6", "7"], correctAnswer: 2, explanation: "A touchdown is worth 6 points." },
  
  // Sports - Medium
  { id: 18, difficulty: 'medium', topic: 'sports', question: "Which country won the FIFA World Cup in 2018?", options: ["Germany", "Brazil", "France", "Argentina"], correctAnswer: 2, explanation: "France won the 2018 FIFA World Cup." },
  { id: 19, difficulty: 'medium', topic: 'sports', question: "How many Grand Slam tournaments are there in tennis?", options: ["3", "4", "5", "6"], correctAnswer: 1, explanation: "There are 4 Grand Slams: Australian Open, French Open, Wimbledon, US Open." },
  
  // Sports - Hard
  { id: 20, difficulty: 'hard', topic: 'sports', question: "What is the diameter of a basketball hoop in inches?", options: ["16", "18", "20", "22"], correctAnswer: 1, explanation: "A basketball hoop is 18 inches in diameter." },
  { id: 21, difficulty: 'hard', topic: 'sports', question: "Which country has won the most Olympic gold medals in history?", options: ["China", "Russia", "USA", "Germany"], correctAnswer: 2, explanation: "The USA has won the most Olympic gold medals." },
  
  // General Knowledge - Normal
  { id: 22, difficulty: 'normal', topic: 'gk', question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correctAnswer: 2, explanation: "Paris is the capital of France." },
  { id: 23, difficulty: 'normal', topic: 'gk', question: "How many continents are there?", options: ["5", "6", "7", "8"], correctAnswer: 2, explanation: "There are 7 continents." },
  { id: 24, difficulty: 'normal', topic: 'gk', question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctAnswer: 3, explanation: "The Pacific Ocean is the largest." },
  
  // General Knowledge - Medium
  { id: 25, difficulty: 'medium', topic: 'gk', question: "Who painted the Mona Lisa?", options: ["Picasso", "Van Gogh", "Da Vinci", "Michelangelo"], correctAnswer: 2, explanation: "Leonardo da Vinci painted the Mona Lisa." },
  { id: 26, difficulty: 'medium', topic: 'gk', question: "What year did World War II end?", options: ["1943", "1944", "1945", "1946"], correctAnswer: 2, explanation: "World War II ended in 1945." },
  
  // General Knowledge - Hard
  { id: 27, difficulty: 'hard', topic: 'gk', question: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], correctAnswer: 1, explanation: "Vatican City is the smallest country." },
  { id: 28, difficulty: 'hard', topic: 'gk', question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], correctAnswer: 1, explanation: "William Shakespeare wrote Romeo and Juliet." },
];

export const getQuestionsByDifficulty = (difficulty: string, topic?: string): QuizQuestion[] => {
  let filtered = quizQuestions;
  
  if (difficulty !== 'mixed') {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  
  if (topic) {
    filtered = filtered.filter(q => q.topic === topic);
  }
  
  return filtered;
};
