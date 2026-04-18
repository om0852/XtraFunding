import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/lib/models/Campaign';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const campaign = await Campaign.findById(id).populate('founderId', 'name email startupDetails');
    
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: campaign });
  } catch (error: any) {
    console.error('Fetch campaign error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
