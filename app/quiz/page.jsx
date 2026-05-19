'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(true);
  const [instagramRequired, setInstagramRequired] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Check if Instagram ID is provided
    if (!parsedUser.instagramId) {
      setInstagramRequired(true);
      return;
    }
    
    fetchQuestions();
  }, [router]);

  useEffect(() => {
    if (timerActive && !quizCompleted && !showResults && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted && !showResults) {
      handleNextQuestion();
    }
  }, [timeLeft, timerActive, quizCompleted, showResults]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      if (data && data.length > 0) {
        setQuestions(data);
        setAnswers(new Array(data.length).fill(null));
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show Instagram ID required message
  if (instagramRequired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Instagram ID Required</h2>
          <p className="text-gray-600 mb-4">
            Please provide your Instagram ID to take quizzes and win prizes!
          </p>
          <div className="space-y-3">
            <Link href="/profile" className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold">
              Add Instagram ID Now
            </Link>
            <Link href="/" className="block w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Rest of your quiz logic remains the same...
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-600">No questions available. Please add questions via admin panel.</p>
          <Link href="/" className="inline-block mt-4 text-blue-600">Back to Home</Link>
        </div>
      </div>
    );
  }

  // Rest of your quiz rendering...
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 pb-24">
      <AdSpace type="banner" className="mb-4" />
      
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                ⏱️ {timeLeft}s
              </div>
              <div>
                <p className="text-xs text-gray-500">Question {currentQuestion + 1}</p>
                <p className="text-sm font-semibold">of {questions.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Score</p>
              <p className="text-xl font-bold text-blue-600">{score}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
          <div className="text-center mb-3">
            <span className="text-4xl">❓</span>
          </div>
          <h2 className="text-md font-bold text-gray-800 mb-5 text-center leading-relaxed">
            {questions[currentQuestion]?.question}
          </h2>

          <div className="space-y-2">
            {questions[currentQuestion]?.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-3 rounded-xl text-left transition-all text-sm ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedAnswer === option ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {currentQuestion > 0 && (
            <button onClick={() => setCurrentQuestion(currentQuestion - 1)} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-sm active:scale-95">
              ← Previous
            </button>
          )}
          <button
            onClick={() => {
              if (selectedAnswer) {
                const newAnswers = [...answers];
                newAnswers[currentQuestion] = selectedAnswer;
                setAnswers(newAnswers);
                
                if (currentQuestion + 1 < questions.length) {
                  setCurrentQuestion(currentQuestion + 1);
                  setSelectedAnswer(null);
                  setTimeLeft(60);
                } else {
                  // Calculate score
                  let finalScore = 0;
                  newAnswers.forEach((answer, idx) => {
                    if (answer && questions[idx] && answer === questions[idx].answer) {
                      finalScore++;
                    }
                  });
                  setScore(finalScore);
                  setShowResults(true);
                  setTimerActive(false);
                }
              }
            }}
            disabled={!selectedAnswer}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              selectedAnswer
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestion + 1 === questions.length ? '🏆 Finish' : 'Next →'}
          </button>
        </div>
      </div>
      
      <AdSpace type="banner" className="mt-4" />
    </div>
  );
}
