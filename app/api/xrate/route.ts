import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import XRateReport from '@/lib/models/XRateReport';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Utility to map newline separated strings into an array
    const parseList = (str?: string) => {
      if (!str) return [];
      return str.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    };

    const newReport = await XRateReport.create({
      campaignId: body.campaignId,
      overallScore: Number(body.overallScore),
      riskScore: Number(body.riskScore),
      growthScore: Number(body.growthScore),
      teamScore: Number(body.teamScore),
      marketScore: Number(body.marketScore),
      executiveSummary: body.executiveSummary,
      riskFactors: parseList(body.riskFactors),
      growthIndicators: parseList(body.growthIndicators),
      investmentRecommendations: body.investmentRecommendations,
    });

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error: any) {
    console.error('XRate creation error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
