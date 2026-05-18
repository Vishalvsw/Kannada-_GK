import { NextResponse } from 'next/server';

const sampleQuestions = [
  {
    _id: "1",
    question: "What is the capital of Karnataka?",
    options: ["Mysore", "Hubli", "Bengaluru", "Mangaluru"],
    answer: "Bengaluru",
    category: "Karnataka GK",
    difficulty: "easy"
  },
  {
    _id: "2",
    question: "Which is the official language of Karnataka?",
    options: ["Tamil", "Telugu", "Kannada", "Malayalam"],
    answer: "Kannada",
    category: "Karnataka GK",
    difficulty: "easy"
  },
  {
    _id: "3",
    question: "Who is known as 'Father of Karnataka'?",
    options: ["Dr. Rajkumar", "Kuvempu", "Kengal Hanumanthaiah", "Sir M. Visvesvaraya"],
    answer: "Kengal Hanumanthaiah",
    category: "Karnataka History",
    difficulty: "medium"
  },
  {
    _id: "4",
    question: "Which is the highest waterfall in Karnataka?",
    options: ["Jog Falls", "Shivanasamudra Falls", "Hebbe Falls", "Abbey Falls"],
    answer: "Jog Falls",
    category: "Karnataka Geography",
    difficulty: "easy"
  },
  {
    _id: "5",
    question: "The famous Hampi ruins are located in which district?",
    options: ["Vijayapura", "Ballari", "Vijayanagara", "Raichur"],
    answer: "Vijayanagara",
    category: "Karnataka History",
    difficulty: "medium"
  }
];

export async function GET() {
  try {
    return NextResponse.json(sampleQuestions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newQuestion = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    };
    sampleQuestions.push(newQuestion);
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const index = sampleQuestions.findIndex(q => q._id === id);
    if (index !== -1) {
      sampleQuestions.splice(index, 1);
      return NextResponse.json({ message: 'Question deleted' });
    }
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
