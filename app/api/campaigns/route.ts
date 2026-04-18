import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/lib/models/Campaign';
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
    
    // Simple validation
    const { founderId, title, sector, stage, tagline, pitch, fundingGoal, minimumInvestment, endDate, location, fundingType } = body;
    
    if (!founderId || !title || !fundingGoal || !endDate || !fundingType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate FHE Keys for this campaign
    const keyPair = await FHEUtils.generateKeyPair(2048);
    
    // Encrypt the initial 0 amount to get a valid initial ciphertext
    const initialEncryptedValue = FHEUtils.encrypt(
      keyPair.publicKey.n, 
      keyPair.publicKey.g, 
      0
    );

    const campaign = await Campaign.create({
      ...body,
      status: 'Active',
      amountRaised: 0,
      paillierPublicKey: keyPair.publicKey,
      encryptedTotalRaised: initialEncryptedValue
    });

    return NextResponse.json({ 
      success: true, 
      data: campaign,
      fhePrivateKey: keyPair.privateKey // Return private key to founder ONLY during creation
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create campaign error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
