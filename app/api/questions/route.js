import { NextResponse } from 'next/server';

// In-memory storage (persists across requests but resets on cold start)
let questions = [];

export async function GET() {
  try {
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }
    if (!body.options || body.options.length !== 4) {
      return NextResponse.json({ error: '4 options are required' }, { status: 400 });
    }
    if (!body.answer) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 });
    }
    
    const newQuestion = {
      _id: Date.now().toString(),
      question: body.question,
      options: body.options,
      answer: body.answer,
      category: body.category || 'General',
      difficulty: body.difficulty || 'medium',
      createdAt: new Date().toISOString()
    };
    
    questions.push(newQuestion);
    console.log('Question added. Total:', questions.length);
    
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    questions = questions.filter(q => q._id !== id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
