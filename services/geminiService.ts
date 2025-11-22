
import { GoogleGenAI } from "@google/genai";

// Initialize the client only if API key is available. 
// In a real app, we handle the missing key gracefully in UI.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const refineText = async (text: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    console.warn("API Key missing");
    return text; // Fallback
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a senior academic editor for a top-tier scientific journal. Your task is to rewrite the following text to improve its clarity, conciseness, and academic tone.

Guidelines:
1. Use precise, objective, and formal language suitable for publication.
2. Eliminate redundancy and improve flow.
3. CRITICAL: Preserve ALL LaTeX math formatting exactly as it appears (e.g., $x$, $$E=mc^2$$). Do not alter equations.
4. Return ONLY the refined text, with no introductory or concluding remarks.

Text to refine:
"${text}"`,
    });
    
    return response.text || text;
  } catch (error) {
    console.error("Gemini refinement failed:", error);
    return text;
  }
};

export const generateAbstract = async (title: string, notes: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "";

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Draft a structured scientific abstract (150-250 words) based on the following details.

Title: "${title}"
Draft Content/Notes: "${notes}"

Requirements:
1. Structure the abstract so it implicitly covers: Context/Background, Methodology, Key Findings (inferred if necessary), and Implications.
2. Use sophisticated, domain-appropriate terminology.
3. Maintain a neutral, objective academic voice.
4. If the input contains LaTeX, ensure it is correctly formatted in the output.
5. Return ONLY the abstract text.`
    });
    return response.text || "";
  } catch (error) {
    console.error("Abstract generation failed:", error);
    return "";
  }
};

export const enhanceBio = async (text: string, context: 'bio' | 'experience' | 'project'): Promise<string> => {
    const ai = getClient();
    if (!ai) return text;

    let contextPrompt = "";
    if (context === 'bio') contextPrompt = "professional academic biography";
    if (context === 'experience') contextPrompt = "job description for an academic CV";
    if (context === 'project') contextPrompt = "technical project description for a portfolio";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Rewrite the following text to be impactful, professional, and concise, suitable for a ${contextPrompt}. Use action verbs and quantitative metrics where implied.
            
            Input Text: "${text}"
            
            Return ONLY the enhanced text.`
        });
        return response.text || text;
    } catch (error) {
        console.error("Bio enhancement failed:", error);
        return text;
    }
}
