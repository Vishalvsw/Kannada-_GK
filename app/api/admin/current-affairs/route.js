import { NextResponse } from 'next/server';

let currentAffairs = [
  { id: 1, title: "ಕರ್ನಾಟಕ ಬಜೆಟ್ 2024 - ಪ್ರಮುಖ ಅಂಶಗಳು", title_en: "Karnataka Budget 2024 - Key Highlights", content: "₹3.71 ಲಕ್ಷ ಕೋಟಿ ಬಜೆಟ್ ಮಂಡಿಸಲಾಗಿದೆ...", content_en: "Budget of ₹3.71 lakh crore presented...", category: "Economy", date: "2024-05-20", important: true }
];
let nextId = 2;

export async function GET() {
  try {
    return NextResponse.json(currentAffairs);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newCA = { id: nextId++, ...body, date: new Date().toISOString().split('T')[0] };
    currentAffairs.push(newCA);
    return NextResponse.json(newCA, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    const index = currentAffairs.findIndex(c => c.id === id);
    if (index !== -1) {
      currentAffairs.splice(index, 1);
      return NextResponse.json({ message: 'Deleted' });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
