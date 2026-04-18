import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Negotiation from '@/lib/models/Negotiation';
import Campaign from '@/lib/models/Campaign';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const investorId = searchParams.get('investorId');
    const startupId = searchParams.get('startupId');

    const query: any = {};
    if (campaignId) query.campaignId = campaignId;
    if (investorId) query.investorId = investorId;
    if (startupId) query.startupId = startupId;

    const negotiations = await Negotiation.find(query)
      .populate('investorId', 'name email')
      .populate('campaignId', 'title sector');

    return NextResponse.json({ success: true, data: negotiations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { investorId, startupId, campaignId, offer } = body;

    if (!investorId || !startupId || !campaignId || !offer) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Check if negotiation already exists for this pair
    let negotiation = await Negotiation.findOne({ investorId, campaignId });

    if (negotiation) {
      return NextResponse.json({ error: 'Negotiation already exists' }, { status: 400 });
    }

    negotiation = await Negotiation.create({
      investorId,
      startupId,
      campaignId,
      status: 'Negotiating',
      offers: [{
        ...offer,
        timestamp: new Date()
      }]
    });

    return NextResponse.json({ success: true, data: negotiation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
