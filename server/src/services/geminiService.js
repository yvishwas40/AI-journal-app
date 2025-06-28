import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeEntry = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Analyze this journal entry and provide the following information in JSON format:
    
    Journal Entry: "${text}"
    
    Please provide:
    1. A brief summary (max 100 words)
    2. The primary emotional mood (choose from: happy, sad, anxious, neutral, excited, reflective, angry, calm)
    3. Confidence level (0-1) in the mood detection
    4. Key keywords/themes (max 5)
    5. Overall sentiment (positive, negative, neutral)
    
    Response format:
    {
      "summary": "Brief summary here",
      "mood": "detected_mood",
      "confidence": 0.85,
      "keywords": ["keyword1", "keyword2"],
      "sentiment": "positive/negative/neutral"
    }
    
    Only return valid JSON without any additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text_response = response.text();

    try {
      const cleanResponse = text_response.replace(/```json|```/g, '').trim();
      const analysis = JSON.parse(cleanResponse);

      return {
        summary: analysis.summary || '',
        mood: ['happy', 'sad', 'anxious', 'neutral', 'excited', 'reflective', 'angry', 'calm']
          .includes(analysis.mood) ? analysis.mood : 'neutral',
        confidence: Math.min(Math.max(analysis.confidence || 0.5, 0), 1),
        keywords: Array.isArray(analysis.keywords) ? analysis.keywords.slice(0, 5) : [],
        sentiment: ['positive', 'negative', 'neutral'].includes(analysis.sentiment)
          ? analysis.sentiment : 'neutral'
      };
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      throw new Error('Invalid AI response format');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('AI analysis failed');
  }
};
