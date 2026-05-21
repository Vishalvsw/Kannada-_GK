import { NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/storage';

export async function GET() {
  try {
    const users = getUsers();
    const validUsers = users.filter(u => u.instagramId && u.instagramId !== 'null');
    const sortedUsers = [...validUsers].sort((a, b) => (b.score || 0) - (a.score || 0));
    return NextResponse.json(sortedUsers);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const users = getUsers();
    
    if (body.instagramId && body.instagramId !== 'null') {
      const existingIndex = users.findIndex(u => u.instagramId === body.instagramId);
      if (existingIndex === -1) {
        users.push(body);
      } else {
        users[existingIndex] = { ...users[existingIndex], ...body };
      }
      saveUsers(users);
    }
    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
