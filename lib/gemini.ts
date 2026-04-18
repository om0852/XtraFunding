import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getStrategicMatches(investorProfile: any, startups: any[]) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          matches: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                startupId: { type: SchemaType.STRING },
                impactScore: { type: SchemaType.NUMBER },
                strategicEdge: { type: SchemaType.STRING },
                synergyRationale: { type: SchemaType.STRING },
                recommendedAction: { type: SchemaType.STRING },
              },
              required: ["startupId", "impactScore", "strategicEdge", "synergyRationale", "recommendedAction"],
            },
          },
        },
      },
    },
  });

  const prompt = `
    You are an elite VC Strategic Matchmaker. 
    Analyze the following Investor Profile and a list of Startups.
    
    INVESTOR PROFILE:
    Expertise: ${investorProfile.expertise}
    Network: ${investorProfile.network}
    Personality: ${investorProfile.personality}
    Investment Focus: ${investorProfile.investmentFocus}
    
    STARTUPS:
    ${JSON.stringify(startups.map(s => ({
      id: s._id,
      title: s.title,
      sector: s.sector,
      tagline: s.tagline,
      pitch: s.pitch,
      stage: s.stage
    })))}
    
    TASK:
    Find the best strategic matches for this investor. 
    For each match, explain "Why this investor is the BEST fit for this startup" specifically based on their UNIQUE expertise and network.
    Do not just say the startup is good. Focus on the SYNERGY.
    
    Output JSON format only.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}
