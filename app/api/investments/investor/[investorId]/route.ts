import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Investment from '@/lib/models/Investment';
import '@/lib/models/Campaign'; // Ensure Campaign model is registered for population

export async function GET(
  req: Request,
  { params }: { params: Promise<{ investorId: string }> }
) {
  try {
    await dbConnect();
    const { investorId } = await params;

    const investments = await Investment.find({ investorId })
      .populate('campaignId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: investments });
  } catch (error: any) {
    console.error('Fetch investor investments error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
