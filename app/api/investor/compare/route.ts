import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import XRateReport from '@/lib/models/XRateReport';
import Campaign from '@/lib/models/Campaign';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: "gemini-3-flash-preview",
  generationConfig: { responseMimeType: "application/json" }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dealIds, preferences } = body;

    if (!dealIds || !Array.isArray(dealIds) || dealIds.length < 2) {
      return NextResponse.json({ error: 'Please select at least 2 deals to compare' }, { status: 400 });
    }

    await dbConnect();
    console.log('[API] Compare Deal IDs:', dealIds);

    // Fetch Campaigns to get their linked XRate report IDs
    const campaigns = await Campaign.find({
      _id: { $in: dealIds }
    }).select('title xrateReportId');
    
    // HEALING LOGIC: Fix missing links for legacy/test campaigns on the fly
    for (const campaign of campaigns) {
      if (!campaign.xrateReportId) {
        console.log(`[API] Healing missing link for: ${campaign.title}`);
        const foundReport = await XRateReport.findOne({ 
          startupName: { $regex: new RegExp(`^${campaign.title}$`, 'i') } 
        }).sort({ createdAt: -1 });

        if (foundReport) {
          console.log(`[API] Auto-linked ${campaign.title} to report ${foundReport._id}`);
          campaign.xrateReportId = foundReport._id;
          await Campaign.updateOne({ _id: campaign._id }, { xrateReportId: foundReport._id });
        }
      }
    }

    const reportIds = campaigns
      .map(c => c.xrateReportId)
      .filter(id => id != null);

    if (reportIds.length === 0) {
      return NextResponse.json({ 
        error: 'No linked XRate reports found for the selected deals. Startups must link a report during campaign creation.' 
      }, { status: 404 });
    }

    // Fetch the specific XRate reports
    const reports = await XRateReport.find({
      _id: { $in: reportIds }
    });

    if (reports.length === 0) {
      return NextResponse.json({ 
        error: 'The linked reports could not be found.' 
      }, { status: 404 });
    }

    const reportData = reports.map(r => ({
      name: r.startupName,
      industry: r.industry,
      overallScore: r.overallScore,
      riskScore: r.riskScore,
      growthScore: r.growthScore,
      executiveSummary: r.executiveSummary,
      investmentThesis: r.investmentThesis,
      growthIndicators: r.growthIndicators,
      riskFactors: r.riskFactors,
      swot: r.swot,
      moat: r.moatAnalysis
    }));

    const prompt = `
      You are a Senior Strategic Investment Advisor. Compare the following funding deals based on their institutional XRate reports and the user's specific investment preferences.
      
      USER PREFERENCES:
      - Horizon: ${preferences.horizon}
      - Risk Tolerance: ${preferences.risk}
      - Primary Goal: ${preferences.goal}
      - Additional Focus: ${preferences.focus || 'None specified'}
      
      DEAL REPORTS:
      ${JSON.stringify(reportData, null, 2)}
      
      Provide a detailed comparison in JSON format. For each deal, provide a "suitabilityScore" (0-100) specifically tailored to how well it fits the USER PREFERENCES, a "suitabilityRationale", and pick one "TOP_PICK" if applicable.
      
      JSON Structure:
      {
        "comparison": {
          "deals": [
            {
              "id": "string (match name or index)",
              "name": "string",
              "suitabilityScore": number,
              "suitabilityRationale": "string (why it fits or doesn't fit user preferences)",
              "xrateScore": number,
              "riskScore": number,
              "keyAdvantage": "string (the single most strategic reason to pick this one)",
              "recommendation": "TOP_PICK" | "CONSIDER" | "AVOID"
            }
          ],
          "overallConclusion": "string (a summary explaining which deal is best and why, or how to build a portfolio with them)"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean up potential markdown code blocks
    if (responseText.includes('```')) {
      responseText = responseText.replace(/```json|```/g, '').trim();
    }
    
    const aiData = JSON.parse(responseText);

    return NextResponse.json({ success: true, comparison: aiData.comparison });
  } catch (error: any) {
    console.error('Comparison error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
