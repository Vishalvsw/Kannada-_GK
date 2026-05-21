import { NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/storage';

export async function GET() {
  try {
    const users = getUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.instagramId === body.instagramId);
    if (existingIndex === -1) {
      users.push(body);
      saveUsers(users);
    }
    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
