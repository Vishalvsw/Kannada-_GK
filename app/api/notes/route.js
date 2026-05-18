import { NextResponse } from 'next/server';

const notesData = [
  { id: 1, title: "Karnataka History - Important Dynasties", category: "History", content: "The major dynasties that ruled Karnataka include Kadambas, Chalukyas, Rashtrakutas, Hoysalas, Vijayanagara Empire...", date: "2024-05-17" },
  { id: 2, title: "KAS Exam - Complete Syllabus Guide", category: "Exam Guide", content: "KAS exam consists of Prelims, Mains, and Interview. Prelims has two papers of 200 marks each...", date: "2024-05-16" },
  { id: 3, title: "Karnataka Geography - Rivers and Dams", category: "Geography", content: "Major rivers: Kaveri, Krishna, Tungabhadra, Sharavathi. Important dams: Krishna Raja Sagara, Almatti...", date: "2024-05-15" },
];

export async function GET() {
  try {
    return NextResponse.json(notesData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
