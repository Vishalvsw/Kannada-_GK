import { NextResponse } from 'next/server';

let notes = [
  { id: 1, title: "ಕರ್ನಾಟಕ ಇತಿಹಾಸ - ಪ್ರಮುಖ ರಾಜವಂಶಗಳು", title_en: "Karnataka History - Important Dynasties", category: "History", content: "ಕರ್ನಾಟಕವನ್ನು ಆಳಿದ ಪ್ರಮುಖ ರಾಜವಂಶಗಳು: ಕದಂಬರು, ಚಾಲುಕ್ಯರು, ರಾಷ್ಟ್ರಕೂಟರು, ಹೊಯ್ಸಳರು, ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ...", content_en: "Major dynasties: Kadambas, Chalukyas, Rashtrakutas, Hoysalas, Vijayanagara Empire...", date: "2024-05-20" }
];
let nextId = 2;

export async function GET() {
  try {
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newNote = { id: nextId++, ...body, date: new Date().toISOString().split('T')[0] };
    notes.push(newNote);
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes.splice(index, 1);
      return NextResponse.json({ message: 'Note deleted' });
    }
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
