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
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [resultSaved, setResultSaved] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);
  const questionsPerSet = 10;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    
    // Check if user has Instagram ID
    if (!userData.instagramId) {
      router.push('/setup-instagram');
      return;
    }
    
    setUser(userData);
    setStartTime(Date.now());
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

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
    }
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setTimeLeft(60);
    } else {
      calculateScore();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setTimeLeft(60);
    }
  };

  const calculateScore = () => {
    let finalScore = 0;
    answers.forEach((answer, idx) => {
      if (answer && questions[idx] && answer === questions[idx].answer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setEndTime(Date.now());
    setShowResults(true);
    setTimerActive(false);
    saveQuizResult(finalScore);
  };

  const saveQuizResult = async (finalScore) => {
    if (!user || resultSaved) return;
    
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const timeFormatted = `${minutes}m ${seconds}s`;
    
    const resultData = {
      userId: user.id || user.instagramId,
      userName: user.name || user.instagramId,
      userEmail: user.email,
      instagramId: user.instagramId,
      score: finalScore,
      totalQuestions: questions.length,
      percentage: (finalScore / questions.length) * 100,
      timeTaken: timeTaken,
      timeFormatted: timeFormatted,
      answers: answers,
      correctCount: finalScore,
      wrongCount: questions.length - finalScore,
      date: new Date().toISOString()
    };
    
    try {
      const response = await fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
      });
      if (response.ok) {
        setResultSaved(true);
        console.log('Quiz result saved successfully!');
        
        // Update user score in localStorage
        const updatedUser = { ...user, score: finalScore, totalQuizzesTaken: (user.totalQuizzesTaken || 0) + 1 };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setShowResults(false);
    setAnswers(new Array(questions.length).fill(null));
    setTimeLeft(60);
    setTimerActive(true);
    setStartTime(Date.now());
    setResultSaved(false);
    fetchQuestions();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-4">Please add questions through the admin panel.</p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (showResults && !quizCompleted) {
    const percentage = (score / questions.length) * 100;
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-5 pb-24">
        <AdSpace type="banner" className="mb-4" />
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-gray-600 mb-4">Great effort, {user?.name}!</p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Your Score</p>
                  <p className="text-3xl font-bold text-blue-600">{score}<span className="text-lg text-gray-500">/{questions.length}</span></p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Time Taken</p>
                  <p className="text-lg font-bold text-green-600">{minutes}m {seconds}s</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Correct</p>
                  <p className="text-xl font-bold text-green-600">{score}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Percentage</p>
                  <p className="text-xl font-bold text-purple-600">{percentage.toFixed(0)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-3 mb-4">
              <p className="text-sm text-yellow-800">📸 Your Instagram ID: @{user?.instagramId}</p>
            </div>

            <div className="space-y-3">
              <button onClick={() => setQuizCompleted(true)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold">
                View Detailed Answers
              </button>
              <button onClick={handleRestart} className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold">
                🔄 Try Again
              </button>
              <Link href="/" className="block w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold text-center">
                🏠 Back to Home
              </Link>
            </div>
          </div>
        </div>
        <AdSpace type="banner" className="mt-4" />
      </div>
    );
  }

  if (quizCompleted) {
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-5 pb-24">
        <AdSpace type="banner" className="mb-4" />
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">📋 Detailed Results</h2>
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">@{user?.instagramId}</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <div className="p-2 bg-blue-50 rounded-lg">
                <p className="text-gray-500">Score</p>
                <p className="font-bold text-blue-600">{score}/{questions.length}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <p className="text-gray-500">Time</p>
                <p className="font-bold text-green-600">{minutes}m {seconds}s</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <p className="text-gray-500">Correct</p>
                <p className="font-bold text-green-600">{score}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <p className="text-gray-500">Wrong</p>
                <p className="font-bold text-red-600">{questions.length - score}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-start gap-2">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${answers[idx] === q.answer ? 'bg-green-500' : 'bg-red-500'}`}>
                    {answers[idx] === q.answer ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{idx + 1}. {q.question}</p>
                    <p className="text-xs text-green-600 mt-1">✓ Correct: {q.answer}</p>
                    {answers[idx] && answers[idx] !== q.answer && (
                      <p className="text-xs text-red-600">✗ Your: {answers[idx]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleRestart} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold text-sm">Try Again</button>
            <Link href="/" className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl font-semibold text-sm text-center">Home</Link>
          </div>
        </div>
        <AdSpace type="banner" className="mt-4" />
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 pb-24">
      <AdSpace type="banner" className="mb-4" />
      
      <div className="max-w-md mx-auto">
        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-md p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-xs text-gray-500">Logged in as</p>
              <p className="text-sm font-semibold">@{user?.instagramId}</p>
            </div>
          </div>
          <Link href="/profile" className="text-xs text-blue-600">View Profile →</Link>
        </div>

        {/* Progress */}
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
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
          <div className="text-center mb-3">
            <span className="text-4xl">❓</span>
          </div>
          <h2 className="text-md font-bold text-gray-800 mb-5 text-center leading-relaxed">
            {currentQ?.question}
          </h2>

          <div className="space-y-2">
            {currentQ?.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-3 rounded-xl text-left transition-all text-sm ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedAnswer === option ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {selectedAnswer === option && <span className="text-green-500 text-lg">✓</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2">
          {currentQuestion > 0 && (
            <button onClick={handlePreviousQuestion} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-sm active:scale-95">
              ← Previous
            </button>
          )}
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              selectedAnswer
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestion + 1 === questions.length ? '🏆 Finish Quiz' : 'Next →'}
          </button>
        </div>
        
        {/* Instagram ID Reminder */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">📸 Your Instagram ID: @{user?.instagramId}</p>
        </div>
      </div>
      
      <AdSpace type="banner" className="mt-4" />
    </div>
  );
}
