import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: "gemini-3-flash-preview",
  generationConfig: { responseMimeType: "application/json" }
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided for extraction' }, { status: 400 });
    }

    const prompt = `
      You are an expert data extraction AI. You have been provided with the raw text of a past XRate startup report.
      Your task is to identify and reconstruct the ORIGINAL input fields that were used to generate this report.
      
      Extract the following fields in JSON format:
      {
        "startupName": "string",
        "industry": "string",
        "description": "string (the original elevator pitch)",
        "fundingGoal": "string (just the amount/goal)",
        "keyFeatures": "string (the core unique selling points or features identified in the report)"
      }
      
      Raw Text:
      """
      ${text}
      """
      
      Look closely at the 'Executive Summary', 'Investment Thesis', and 'Startup Info' sections to reconstruct the most accurate version of the original inputs. 
      If a field is absolutely not findable, leave it as an empty string.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Debug log to see what Gemini actually returns
    console.log('Gemini Extraction Raw Response:', responseText);

    let extractedData = JSON.parse(responseText);

    // Handle cases where Gemini might nest the data under a 'data' or similar key
    if (extractedData.data && typeof extractedData.data === 'object') {
      extractedData = extractedData.data;
    }

    // Check if the extracted data is actually populated
    const hasData = Object.values(extractedData).some(val => val && val !== '');

    return NextResponse.json({ 
      success: true, 
      data: extractedData,
      found: hasData 
    });
  } catch (error: any) {
    console.error('XRate Extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract data from PDF', details: error.message },
      { status: 500 }
    );
  }
}
