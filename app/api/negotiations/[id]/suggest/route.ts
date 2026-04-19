import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Negotiation from '@/lib/models/Negotiation';
import XRateReport from '@/lib/models/XRateReport';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-3-flash-preview',
  generationConfig: { responseMimeType: 'application/json' },
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const { requestingRole } = await req.json(); // 'INVESTOR' | 'STARTUP'

    const negotiation = await Negotiation.findById(id)
      .populate('investorId', 'name')
      .populate('startupId', 'name')
      .populate('campaignId');

    if (!negotiation) {
      return NextResponse.json({ error: 'Negotiation not found' }, { status: 404 });
    }

    const campaign = negotiation.campaignId as any;

    // Fetch linked XRate report if available
    let xrateContext = 'No XRate report is linked to this campaign.';
    if (campaign?.xrateReportId) {
      const report = await XRateReport.findById(campaign.xrateReportId);
      if (report) {
        xrateContext = `
XRate Analysis Report for ${report.startupName}:
- Overall Score: ${report.overallScore}/100
- Risk Score: ${report.riskScore}/100 (higher = riskier)
- Growth Score: ${report.growthScore}/100
- Team Score: ${report.teamScore}/100
- Market Score: ${report.marketScore}/100
- Investment Thesis: ${report.investmentThesis}
- Risk Factors: ${report.riskFactors?.join('; ') || 'N/A'}
- Growth Indicators: ${report.growthIndicators?.join('; ') || 'N/A'}
- SWOT Strengths: ${report.swot?.strengths?.join('; ') || 'N/A'}
- SWOT Weaknesses: ${report.swot?.weaknesses?.join('; ') || 'N/A'}
- TAM: ${report.marketAnalysis?.tam || 'N/A'}
- Moat Analysis: ${report.moatAnalysis || 'N/A'}
- Investment Recommendations: ${report.investmentRecommendations || 'N/A'}
        `.trim();
      }
    }

    const offerHistory = negotiation.offers
      .map((o: any, i: number) => {
        return `Offer #${i + 1} by ${o.sender}: ₹${o.amount.toLocaleString('en-IN')} for ${o.equity}% equity (${o.instrumentType}). Terms: "${o.terms}"`;
      })
      .join('\n');

    const latestOffer = negotiation.offers[negotiation.offers.length - 1];

    const prompt = `
You are XAgent, an elite AI deal-making advisor embedded in XtraFunding — a startup investment platform. 
You are helping the ${requestingRole} (${requestingRole === 'INVESTOR' ? (negotiation.investorId as any).name : (negotiation.startupId as any).name}) navigate a live negotiation.

CAMPAIGN DETAILS:
- Startup: ${campaign?.title || 'Unknown'}
- Sector: ${campaign?.sector || 'Unknown'}
- Stage: ${campaign?.stage || 'Unknown'}
- Funding Goal: ₹${campaign?.fundingGoal?.toLocaleString('en-IN') || 'N/A'}
- Funding Type: ${campaign?.fundingType || 'Equity'}
- Equity Offered (original): ${campaign?.equityOffered || 'N/A'}%

${xrateContext}

NEGOTIATION HISTORY (${negotiation.offers.length} exchanges so far):
${offerHistory}

LATEST OFFER ON TABLE:
${latestOffer.sender} offered ₹${latestOffer.amount.toLocaleString('en-IN')} for ${latestOffer.equity}% ${latestOffer.instrumentType}

YOUR TASK:
As an impartial AI advisor for the ${requestingRole}, analyze the negotiation trajectory and XRate data to suggest the single best counter-offer that:
1. Moves the negotiation toward a fair ZOPA (Zone of Possible Agreement)
2. Is grounded in the startup's XRate scores and risk profile
3. Is realistic given the offer history trend
4. Protects the ${requestingRole}'s interests while keeping the deal alive

Respond ONLY with this JSON structure (no markdown, no explanation outside JSON):
{
  "suggestedAmount": number (in INR, no commas, just the number),
  "suggestedEquity": number (percentage, e.g. 8.5),
  "suggestedInstrumentType": "SAFE" | "Equity" | "Convertible Note",
  "suggestedTerms": "string (1-2 sentence rationale/terms to include in the offer message)",
  "reasoning": "string (2-3 sentence explanation of WHY this is the right move — cite XRate scores if relevant)",
  "dealHealthScore": number (0-100, how likely this negotiation is to close successfully),
  "dealHealthLabel": "string (e.g. 'Strong', 'Moderate', 'At Risk')",
  "redFlags": ["string"] (any concerns the ${requestingRole} should be aware of, empty array if none),
  "closingProbability": "string (e.g. '78% likely to close if this offer is accepted')"
}
    `.trim();

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean up potential markdown code blocks if the model ignores the mime type setting
    if (responseText.includes('```')) {
      responseText = responseText.replace(/```json|```/g, '').trim();
    }
    
    const suggestion = JSON.parse(responseText);

    return NextResponse.json({ success: true, suggestion });
  } catch (error: any) {
    console.error('XAgent suggest error:', error);
    return NextResponse.json(
      { error: 'XAgent failed to generate suggestion', details: error.message },
      { status: 500 }
    );
  }
}
