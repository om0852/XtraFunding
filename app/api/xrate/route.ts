import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import XRateReport from '@/lib/models/XRateReport';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: "gemini-3-flash-preview",
  generationConfig: { responseMimeType: "application/json" }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startupName, industry, description, fundingGoal, keyFeatures, campaignId } = body;

    if (!startupName || !industry || !description) {
      return NextResponse.json({ error: 'Missing required startup details' }, { status: 400 });
    }

    await dbConnect();

    const prompt = `
      You are an expert Venture Capital Analyst. Analyze the following startup and provide a detailed XRate Report in JSON format.
      
      Startup Name: ${startupName}
      Industry: ${industry}
      Description: ${description}
      Funding Goal: ${fundingGoal || 'Not specified'}
      Key Features/Success Factors: ${keyFeatures || 'Not specified'}
      
      The JSON response must follow this structure:
      {
        "overallScore": number (0-100),
        "riskScore": number (0-100),
        "growthScore": number (0-100),
        "teamScore": number (0-100),
        "marketScore": number (0-100),
        "executiveSummary": "string (around 100-150 words)",
        "riskFactors": ["string", "string", ...],
        "growthIndicators": ["string", "string", ...],
        "investmentRecommendations": "string (professional advice)"
      }
      
      Be objective, critical, and insightful.
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
      riskFactors: aiData.riskFactors,
      growthIndicators: aiData.growthIndicators,
      investmentRecommendations: aiData.investmentRecommendations,
      campaignId: campaignId || null,
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
