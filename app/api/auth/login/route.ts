import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    await dbConnect();

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Direct password match check (should be updated to bcrypt.compare in production)
    if (user.password !== password) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Successful login!
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
