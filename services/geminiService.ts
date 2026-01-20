
import { GoogleGenAI } from "@google/genai";

export const getLoveAdvice = async (name1: string, name2: string, score: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    You are a 2004-era Korean teenager on Cyworld. 
    Interpret a "Name Compatibility Test" (이름 궁합) result.
    Person 1: ${name1}
    Person 2: ${name2}
    Score: ${score}%
    
    Instructions:
    - Use 2000s Korean internet slang (e.g., ~했삼, ~해여, 즐!, OTL).
    - Use emojis like (づ￣ ³￣)づ, ( ^_^)/, s(￣▽￣)v.
    - If the score is high (>80), be super enthusiastic and call them a "Legendary Couple".
    - If it's low (<30), tell them "Don't be sad, just friends~ OTL".
    - Keep it under 200 characters.
    - Response must be in Korean.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "서버가 부끄러워하나봐여.. 잠시만여! s(￣▽￣)v";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "사랑의 점괘를 읽는 중 오류가 발생했삼! 즐! ( ^_^)/";
  }
};
