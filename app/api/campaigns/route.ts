import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/lib/models/Campaign';
import XRateReport from '@/lib/models/XRateReport';
import { FHEUtils } from '@/lib/crypto/fhe';

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
    console.log('[API] Create Campaign Payload:', JSON.stringify(body, null, 2));
    
    // Simple validation
    const { founderId, title, sector, stage, tagline, pitch, fundingGoal, minimumInvestment, endDate, location, fundingType, xrateReportId } = body;
    
    if (!founderId || !title || !fundingGoal || !endDate || !fundingType || !xrateReportId) {
      return NextResponse.json({ error: 'Missing required fields including XRate Report linkage' }, { status: 400 });
    }

    // Generate FHE Keys for this campaign (Remote feature)
    const keyPair = await FHEUtils.generateKeyPair(2048);
    
    // Encrypt the initial 0 amount to get a valid initial ciphertext (Remote feature)
    const initialEncryptedValue = FHEUtils.encrypt(
      keyPair.publicKey.n, 
      keyPair.publicKey.g, 
      0
    );

    // Create Campaign with both FHE and XRate linkage
    const campaign = await Campaign.create({
      founderId,
      title,
      sector,
      stage,
      tagline,
      pitch,
      fundingGoal,
      minimumInvestment,
      fundingModel: body.fundingModel || 'XFund',
      endDate: new Date(endDate),
      location,
      fundingType,
      equityOffered: body.equityOffered,
      interestRate: body.interestRate,
      repaymentMonths: body.repaymentMonths,
      xrateReportId,
      status: 'Active',
      amountRaised: 0,
      onChainCampaignId: body.onChainCampaignId,
      paillierPublicKey: keyPair.publicKey,
      encryptedTotalRaised: initialEncryptedValue
    });

    console.log('[API] Saved Campaign with Multi-Feature support:', {
      id: campaign._id,
      title: campaign.title,
      hasReportId: !!campaign.xrateReportId,
      hasFHE: !!campaign.paillierPublicKey
    });

    // Post-save: Link unowned reports (Our feature logic)
    await XRateReport.updateOne(
      { _id: xrateReportId, ownerId: { $exists: false } },
      { ownerId: founderId }
    );

    // Return sensitive FHE Private Key ONLY during creation
    return NextResponse.json({ 
      success: true, 
      data: campaign,
      fhePrivateKey: keyPair.privateKey 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create campaign error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
