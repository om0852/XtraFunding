import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Investment from '@/lib/models/Investment';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const { status, blockchainTxHash } = await req.json();

    const investment = await Investment.findByIdAndUpdate(id, { 
      status, 
      blockchainTxHash 
    }, { new: true });

    if (!investment) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: investment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // We can also fetch by campaignId and investorId if we don't have the investment ID
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const investorId = searchParams.get('investorId');

    let investment;
    if (id !== 'query') {
      investment = await Investment.findById(id);
    } else if (campaignId && investorId) {
      investment = await Investment.findOne({ campaignId, investorId }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, data: investment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
