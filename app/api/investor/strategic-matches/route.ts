import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Campaign from '@/lib/models/Campaign';
import { getStrategicMatches } from '@/lib/gemini';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user || !user.investorDetails) {
      return NextResponse.json({ success: false, message: 'Investor profile not set up' }, { status: 404 });
    }

    // Fetch active campaigns
    const campaigns = await Campaign.find({ status: 'Active' });

    if (campaigns.length === 0) {
        return NextResponse.json({ success: true, matches: [] });
    }

    // Get strategic matches from Gemini
    const aiResults = await getStrategicMatches(user.investorDetails, campaigns);

    // Merge AI reasoning with campaign data
    const enrichedMatches = aiResults.matches.map((match: any) => {
      const campaign = campaigns.find(c => c._id.toString() === match.startupId);
      return {
        ...match,
        campaign
      };
    }).filter((m: any) => m.campaign); // Ensure campaign exists

    return NextResponse.json({ success: true, matches: enrichedMatches });
  } catch (error: any) {
    console.error('AI Matching Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
