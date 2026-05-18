import { NextResponse } from 'next/server';

const notes = [
  { id: 1, title: "Karnataka History - Important Dynasties", category: "History", content: "The major dynasties that ruled Karnataka include Kadambas (345-525 CE), Chalukyas (543-753 CE), Rashtrakutas (753-982 CE), Hoysalas (1026-1343 CE), Vijayanagara Empire (1336-1646 CE), and Wodeyars of Mysore (1399-1947 CE). Each dynasty contributed significantly to Karnataka's culture, architecture, and literature.", date: "2024-05-17" },
  { id: 2, title: "KAS Exam - Complete Syllabus Guide", category: "Exam Guide", content: "KAS exam consists of Prelims, Mains, and Interview. Prelims has two papers of 200 marks each (General Studies and Aptitude). Mains has 5 papers including Kannada language. Interview carries 50 marks.", date: "2024-05-16" },
];

export async function GET(request, { params }) {
  const id = parseInt(params.id);
  const note = notes.find(n => n.id === id);
  if (note) {
    return NextResponse.json(note);
  }
  return NextResponse.json({ error: 'Note not found' }, { status: 404 });
}
