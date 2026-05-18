import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import { updateUserScore } from '@/lib/auth';

export async function PUT(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }
    
    const { email, score, total } = await req.json();
    await connectToDatabase();
    
    const user = await updateUserScore(email, score, total);
    
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
