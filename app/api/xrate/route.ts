import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import XRateReport from '@/lib/models/XRateReport';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: "gemini-3-flash-preview",
  generationConfig: { responseMimeType: "application/json" }
});

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const startupName = searchParams.get('startupName');

    if (ownerId && startupName) {
      // Auto-migrate legacy reports that match the name but have no owner
      await XRateReport.updateMany(
        { startupName: { $regex: new RegExp(`^${startupName}$`, 'i') }, ownerId: { $exists: false } },
        { ownerId: ownerId }
      );
    }

    // Return reports owned by the user OR reports that have no owner (unclaimed/legacy)
    const query = ownerId 
      ? { $or: [
          { ownerId }, 
          { ownerId: null },
          { ownerId: { $exists: false } }
        ]} 
      : {};
      
    const reports = await XRateReport.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reports });
  } catch (error: any) {
    console.error('Fetch reports error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startupName, industry, description, fundingGoal, keyFeatures, campaignId, ownerId } = body;

    if (!startupName || !industry || !description) {
      return NextResponse.json({ error: 'Missing required startup details' }, { status: 400 });
    }

    await dbConnect();

    const prompt = `
      You are a Senior Venture Capital Analyst at a top-tier firm. Analyze the following startup and provide a premium, institutional-grade XRate Report in JSON format.
      
      Startup Name: ${startupName}
      Industry: ${industry}
      Description: ${description}
      Funding Goal: ${fundingGoal || 'Not specified'}
      Key Features/Success Factors: ${keyFeatures || 'Not specified'}
      
      Your analysis should be critical, insightful, and look beyond the surface. Use the following JSON structure:
      {
        "overallScore": number (0-100),
        "riskScore": number (0-100),
        "growthScore": number (0-100),
        "teamScore": number (0-100),
        "marketScore": number (0-100),
        "executiveSummary": "string (concise overview)",
        "investmentThesis": "string (1-2 sentence core reason for investing or passing)",
        "riskFactors": ["string", "string", ...],
        "growthIndicators": ["string", "string", ...],
        "swot": {
          "strengths": ["string", "string", ...],
          "weaknesses": ["string", "string", ...],
          "opportunities": ["string", "string", ...],
          "threats": ["string", "string", ...]
        },
        "marketAnalysis": {
          "tam": "string (estimated Total Addressable Market with reasoning)",
          "competition": ["string (specific competitor names)", ...],
          "trends": ["string (macro/micro trends)", ...]
        },
        "moatAnalysis": "string (analysis of defensibility/IP/network effects)",
        "milestones": ["string (key KPI or goal for the next 12 months)", ...],
        "investmentRecommendations": "string (deep strategic advice)"
      }
      
      Provide data-driven estimates where possible. If competition is not provided, identify likely incumbents based on the industry.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const aiData = JSON.parse(responseText);

    const newReport = await XRateReport.create({
      startupName,
      industry,
      description,
      overallScore: aiData.overallScore,
      riskScore: aiData.riskScore,
      growthScore: aiData.growthScore,
      teamScore: aiData.teamScore,
      marketScore: aiData.marketScore,
      executiveSummary: aiData.executiveSummary,
      investmentThesis: aiData.investmentThesis,
      riskFactors: aiData.riskFactors,
      growthIndicators: aiData.growthIndicators,
      swot: aiData.swot,
      marketAnalysis: aiData.marketAnalysis,
      moatAnalysis: aiData.moatAnalysis,
      milestones: aiData.milestones,
      investmentRecommendations: aiData.investmentRecommendations,
      campaignId: campaignId || null,
      ownerId: ownerId || null
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
