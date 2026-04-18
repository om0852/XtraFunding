import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/lib/models/Campaign';
import XRateReport from '@/lib/models/XRateReport';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { xrateReportId, founderId } = await request.json();
    const campaignId = params.id;

    if (!xrateReportId) {
      return NextResponse.json({ error: 'XRate Report ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Verify campaign existence and ownership
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Optional: Security check if founderId matches
    if (founderId && campaign.founderId.toString() !== founderId) {
       return NextResponse.json({ error: 'Unauthorized: You are not the owner of this campaign' }, { status: 403 });
    }

    // Update campaign linkage
    campaign.xrateReportId = xrateReportId;
    await campaign.save();

    // Ensure the report is also marked as owned by this founder if it wasn't already
    await XRateReport.updateOne(
      { _id: xrateReportId, ownerId: { $exists: false } }, // Or if it matches null/undefined
      { ownerId: campaign.founderId }
    );

    return NextResponse.json({ success: true, message: 'Campaign linkage updated successfully' });
  } catch (error: any) {
    console.error('Linkage repair error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
