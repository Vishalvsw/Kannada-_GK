import { NextResponse } from 'next/server';

const usersData = [
  { _id: "1", name: "Admin User", email: "admin@example.com", image: "https://ui-avatars.com/api/?name=Admin&background=8B5CF6&color=fff&size=100", role: "admin", score: 0, totalQuizzesTaken: 0, instagramId: "" },
  { _id: "2", name: "Raju Kumar", email: "raju@example.com", image: "https://ui-avatars.com/api/?name=Raju+Kumar&background=3B82F6&color=fff&size=100", role: "user", score: 185, totalQuizzesTaken: 15, instagramId: "@rajukumar" },
];

export async function GET() {
  try {
    return NextResponse.json(usersData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
