import { NextResponse } from 'next/server';

// Sample leaderboard data
const leaderboardData = [
  {
    _id: "1",
    name: "Anil Priya",
    email: "anil@example.com",
    image: "https://ui-avatars.com/api/?name=Anil+Priya&background=10B981&color=fff&size=100",
    score: 265,
    totalQuizzesTaken: 25,
    instagramId: "@anil_priya"
  },
  {
    _id: "2",
    name: "Raju Kumar",
    email: "raju@example.com",
    image: "https://ui-avatars.com/api/?name=Raju+Kumar&background=3B82F6&color=fff&size=100",
    score: 185,
    totalQuizzesTaken: 15,
    instagramId: "@rajukumar"
  },
  {
    _id: "3",
    name: "Priya Sharma",
    email: "priya@example.com",
    image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=8B5CF6&color=fff&size=100",
    score: 192,
    totalQuizzesTaken: 18,
    instagramId: "@priya_sharma"
  }
];

export async function GET() {
  try {
    // Sort by score
    const sorted = [...leaderboardData].sort((a, b) => b.score - a.score);
    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
