export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Investment from '@/lib/models/Investment';
import Campaign from '@/lib/models/Campaign';
import { FHEUtils } from '@/lib/crypto/fhe';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { investorId, campaignId, amount } = body;

    if (!investorId || !campaignId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch Campaign for FHE processing
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // 2. Perform FHE (Additive Homomorphic Encryption)
    let newEncryptedTotal = campaign.encryptedTotalRaised;
    
    if (campaign.paillierPublicKey?.n && campaign.paillierPublicKey?.g) {
      const { n, g } = campaign.paillierPublicKey;
      
      // Encrypt this specific investment amount
      const encryptedInvestment = FHEUtils.encrypt(n, g, amount);
      
      // Homomorphic Add: E(total) * E(new) mod n^2
      newEncryptedTotal = FHEUtils.add(
        n, 
        campaign.encryptedTotalRaised || '0', 
        encryptedInvestment
      );
    }

    // 3. Create the investment record
    const investment = await Investment.create({
      investorId,
      campaignId,
      amount: Number(amount),
      status: 'Completed' 
    });

    // 4. Update the campaign's amountRaised (public) and encrypted total (private audit)
    // Using findByIdAndUpdate with $inc for atomicity and to prevent stale overwrites
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { 
        $inc: { amountRaised: Number(amount) },
        $set: { 
          encryptedTotalRaised: newEncryptedTotal,
          // 5. Update status if target met
          status: (campaign.amountRaised + Number(amount) >= campaign.fundingGoal) ? 'Funded' : campaign.status
        }
      },
      { new: true }
    );

    if (!updatedCampaign) {
      return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: investment,
      campaignStatus: updatedCampaign.status,
      amountRaised: updatedCampaign.amountRaised,
      fheVerificationTag: newEncryptedTotal
    });

  } catch (error: any) {
    console.error('Investment error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
