import { NextResponse } from 'next/server';

let notes = [
  {
    id: 1,
    title: "ಭಾರತದ ಸಂವಿಧಾನದ ಬಗ್ಗೆ ಮಾಹಿತಿ",
    content: `**ರಚನೆ:**\nಭಾರತದ ಸಂವಿಧಾನವನ್ನು ಡಾ. ಬಿ. ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರ ನೇತೃತ್ವದಲ್ಲಿ ರಚಿಸಲಾಯಿತು.\n\nಸಂವಿಧಾನ ಸಭೆ (Constituent Assembly) ಇದನ್ನು ರಚಿಸಿತು.\n1949 ನವೆಂಬರ್ 26ರಂದು ಅಂಗೀಕರಿಸಲಾಯಿತು.\n1950 ಜನವರಿ 26ರಂದು ಜಾರಿಗೆ ಬಂತು (ಇದನ್ನೇ ಗಣರಾಜ್ಯೋತ್ಸವ ದಿನವಾಗಿ ಆಚರಿಸಲಾಗುತ್ತದೆ).\n\n**ಮುಖ್ಯ ಲಕ್ಷಣಗಳು:**\n1. ವಿಶ್ವದಲ್ಲೇ ಅತಿ ದೊಡ್ಡ ಲಿಖಿತ ಸಂವಿಧಾನ.\n2. ಪ್ರಜಾಪ್ರಭುತ್ವ, ಗಣರಾಜ್ಯ,\n3. ಧರ್ಮನಿರಪೇಕ್ಷಿತ, ಸಮಾಜವಾದ ಇವುಗಳ ಮೇಲೆ ಆಧಾರಿತವಾಗಿದೆ.`,
    category: "Constitution",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "ಭಾರತದ ಸಂವಿಧಾನ - ಮುಂದುವರೆದ ಭಾಗ",
    content: `**ಪ್ರಮುಖ ಅಂಶಗಳು:**\n\n• ಸಂವಿಧಾನವು 22 ಭಾಗಗಳು, 395 ಅನುಚ್ಛೇದಗಳು ಮತ್ತು 8 ಅನುಸೂಚಿಗಳನ್ನು ಹೊಂದಿದೆ.\n\n• ಮೂಲಭೂತ ಹಕ್ಕುಗಳು (ಅನುಚ್ಛೇದ 12-35)\n\n• ನಿರ್ದೇಶಕ ತತ್ವಗಳು (ಅನುಚ್ಛೇದ 36-51)\n\n• ಮೂಲಭೂತ ಕರ್ತವ್ಯಗಳು (ಅನುಚ್ಛೇದ 51A)\n\n**ತಿದ್ದುಪಡಿಗಳು:**\nಸಂವಿಧಾನವನ್ನು ಇಲ್ಲಿಯವರೆಗೆ 100 ಕ್ಕೂ ಹೆಚ್ಚು ಬಾರಿ ತಿದ್ದುಪಡಿ ಮಾಡಲಾಗಿದೆ.`,
    category: "Constitution",
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json(notes);
}

export async function POST(request) {
  const body = await request.json();
  const newNote = {
    id: notes.length + 1,
    ...body,
    createdAt: new Date().toISOString()
  };
  notes.push(newNote);
  return NextResponse.json(newNote, { status: 201 });
}
