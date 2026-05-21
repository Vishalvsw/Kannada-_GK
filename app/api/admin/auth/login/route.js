import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock admin credentials (no database needed)
const ADMIN_EMAIL = 'admin@kannadaexampro.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'Super Admin';
const ADMIN_ROLE = 'super_admin';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Check credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create token
      const token = jwt.sign(
        { id: 'admin1', email: ADMIN_EMAIL, role: ADMIN_ROLE },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      
      return NextResponse.json({
        success: true,
        token,
        admin: {
          id: 'admin1',
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          role: ADMIN_ROLE
        }
      });
    }
    
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
