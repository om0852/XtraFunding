import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Investment from '@/lib/models/Investment';
import Campaign from '@/lib/models/Campaign';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { investorId, campaignId, amount } = body;

    if (!investorId || !campaignId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create the investment record
    const investment = await Investment.create({
      investorId,
      campaignId,
      amount,
      status: 'Completed' // Mocking completed since we are using simulated blockchain later
    });

    // 2. Update the campaign's amountRaised
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    campaign.amountRaised += amount;

    // 3. Check if target met
    if (campaign.amountRaised >= campaign.fundingGoal) {
      campaign.status = 'Funded';
    }

    await campaign.save();

    return NextResponse.json({ 
      success: true, 
      data: investment,
      campaignStatus: campaign.status,
      amountRaised: campaign.amountRaised
    });

  } catch (error: any) {
    console.error('Investment error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
