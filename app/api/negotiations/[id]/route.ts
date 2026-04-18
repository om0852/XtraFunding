import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Negotiation from '@/lib/models/Negotiation';
import Campaign from '@/lib/models/Campaign';
import Investment from '@/lib/models/Investment';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const negotiation = await Negotiation.findById(id)
      .populate('investorId', 'name email')
      .populate('startupId', 'name email')
      .populate('campaignId');

    if (!negotiation) {
      return NextResponse.json({ error: 'Negotiation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: negotiation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const { offer, status } = await req.json();

    const negotiation = await Negotiation.findById(id);
    if (!negotiation) {
      return NextResponse.json({ error: 'Negotiation not found' }, { status: 404 });
    }

    // 1. Add counter-offer if provided
    if (offer) {
      negotiation.offers.push({
        ...offer,
        timestamp: new Date()
      });
      // If a new offer is made, status remains "Negotiating" or reverts from "Rejected"
      negotiation.status = 'Negotiating';
    }

    // 2. Update status (Accepted/Rejected/Closed)
    if (status) {
      negotiation.status = status;

      if (status === 'Accepted') {
        const campaignId = negotiation.campaignId;
        
        // Mark campaign as Funded
        await Campaign.findByIdAndUpdate(campaignId, { 
          status: 'Funded',
          amountRaised: negotiation.offers[negotiation.offers.length - 1].amount // Final agreed amount
        });

        // Close all other negotiations for this campaign
        await Negotiation.updateMany(
          { campaignId, _id: { $ne: negotiation._id } },
          { status: 'Closed' }
        );

        // Create an Investment record (Pending)
        const latestOffer = negotiation.offers[negotiation.offers.length - 1];
        await Investment.create({
          investorId: negotiation.investorId,
          campaignId: negotiation.campaignId,
          amount: latestOffer.amount,
          equityPercentage: latestOffer.equity,
          status: 'Pending'
        });
      }
    }

    await negotiation.save();
    
    // Repopulate for frontend consistency
    const populated = await Negotiation.findById(negotiation._id)
      .populate('investorId', 'name email')
      .populate('startupId', 'name email')
      .populate('campaignId');

    return NextResponse.json({ success: true, data: populated });

  } catch (error: any) {
    console.error('Update negotiation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
