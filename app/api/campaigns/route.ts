import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/lib/models/Campaign';

export async function GET() {
  try {
    await dbConnect();
    const campaigns = await Campaign.find({}, 'title _id');
    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    console.error('Fetch campaigns error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
