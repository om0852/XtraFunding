import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/lib/models/Campaign';

export async function GET() {
  try {
    await dbConnect();
    const campaigns = await Campaign.find({});
    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    console.error('Fetch campaigns error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Simple validation
    const { founderId, title, sector, stage, tagline, pitch, fundingGoal, minimumInvestment, endDate, location, fundingType } = body;
    
    if (!founderId || !title || !fundingGoal || !endDate || !fundingType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const campaign = await Campaign.create({
      ...body,
      status: 'Active', // Default to active for this demo
      amountRaised: 0
    });

    return NextResponse.json({ success: true, data: campaign }, { status: 201 });
  } catch (error: any) {
    console.error('Create campaign error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
