import { GoogleGenAI } from "@google/genai";
import { CompetitionData, TrendingKeyword, RankingKeyword, NicheIdea } from "../types";

// Initialize Gemini Client
// IMPORTANT: API Key is from process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

// Helper to parse JSON from text that might contain markdown
const parseJSON = (text: string): any => {
  try {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response", e);
    throw new Error("Failed to parse AI response data.");
  }
};

const extractSources = (response: any): { uri: string; title: string }[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks
    .filter((c: any) => c.web)
    .map((c: any) => ({
      uri: c.web.uri,
      title: c.web.title,
    }));
};

/**
 * 1. Zero Competition Analysis
 */
export const analyzeCompetition = async (keyword: string) => {
  const prompt = `
    Analyze the YouTube competition for the keyword: "${keyword}".
    Use Google Search to find current video counts, top ranking channels, and view counts for this exact topic.
    
    Based on the search results, estimate a competition score (0-100, where 0 is zero competition/easy and 100 is impossible).
    Identify if this is a "Zero Competition" opportunity (Score < 20).
    
    Return a STRICT JSON object with this structure:
    {
      "keyword": "${keyword}",
      "competitionScore": number,
      "searchVolumeEstimate": "string (e.g. 10k/month)",
      "videoCount": "string (e.g. 5,000+)",
      "topChannels": ["string", "string"],
      "avgViews": "string (e.g. 25k)",
      "difficultyLabel": "Low" | "Medium" | "High" | "Zero",
      "opportunityAnalysis": "Short paragraph explaining why this is or isn't a good opportunity."
    }
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  const sources = extractSources(response);
  const data = parseJSON(text) as CompetitionData;
  return { data, sources };
};

/**
 * 2. Trending Keywords (Last 7 Days)
 */
export const findTrendingKeywords = async (niche: string) => {
  const prompt = `
    Find trending YouTube keywords/topics for the niche: "${niche}" that have spiked in popularity in the LAST 7 DAYS.
    Use Google Search to validate recent trends, news, or viral videos in this niche.
    
    Return a STRICT JSON array of objects with this structure:
    [
      {
        "keyword": "string",
        "growthPercentage": number (e.g. 150),
        "searchVolume": "string",
        "relatedQueries": ["string", "string"],
        "trendGraphData": [
             {"day": "Day 1", "value": number},
             {"day": "Day 2", "value": number},
             {"day": "Day 3", "value": number},
             {"day": "Day 4", "value": number},
             {"day": "Day 5", "value": number},
             {"day": "Day 6", "value": number},
             {"day": "Day 7", "value": number}
        ] (Simulate a 7-day trend line based on the hype trajectory)
      }
    ]
    Limit to top 5 trending keywords.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  const sources = extractSources(response);
  const data = parseJSON(text) as TrendingKeyword[];
  return { data, sources };
};

/**
 * 3. Ranking Keywords from Titles
 */
export const extractRankingKeywords = async (titles: string) => {
  const prompt = `
    Analyze these YouTube video titles to find high-ranking, high-CTR keywords:
    
    ${titles}
    
    Extract the most powerful SEO terms.
    Return a STRICT JSON array of objects:
    [
      {
        "term": "string",
        "score": number (0-100 power score),
        "category": "High Volume" | "High CTR" | "SEO Power" | "Trending",
        "occurrence": number (how many times it likely appeared conceptually)
      }
    ]
    Sort by score descending. Limit to top 15 terms.
  `;

  // No search tool needed strictly for NLP extraction, but useful for checking 'Trending' status
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
       tools: [{ googleSearch: {} }], // Added to verify if terms are currently trending
    }
  });

  const text = response.text;
  const sources = extractSources(response);
  const data = parseJSON(text) as RankingKeyword[];
  return { data, sources };
};

/**
 * 4. Niche Keyword Engine
 */
export const analyzeNiche = async (niche: string) => {
  const prompt = `
    Generate a comprehensive YouTube keyword strategy for the niche: "${niche}".
    
    1. Identify 3 trending sub-topics.
    2. Suggest 3 viral video ideas with titles.
    3. List top 3 channels currently dominating this niche.
    
    Return STRICT JSON:
    {
      "trends": [ 
          {
            "keyword": "string", 
            "growthPercentage": 0, 
            "searchVolume": "string", 
            "relatedQueries": [],
            "trendGraphData": [] 
          } 
      ] (Use empty graph data or simulated),
      "ideas": [
        {
          "title": "string",
          "topic": "string",
          "viralPotential": "High" | "Medium" | "Low",
          "reasoning": "string"
        }
      ],
      "topChannels": ["string", "string", "string"]
    }
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  const sources = extractSources(response);
  const data = parseJSON(text) as { trends: TrendingKeyword[], ideas: NicheIdea[], topChannels: string[] };
  return { data, sources };
};
