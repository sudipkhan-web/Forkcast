const fs = require('fs');
let code = fs.readFileSync('src/services/geminiServer.ts', 'utf8');

const newFn = `
export async function serverSuggestFreeTextOptions(category: 'cuisine' | 'dietary' | 'medical', partialText: string): Promise<string[]> {
  try {
    const ai = getGeminiClient();
    
    let description = '';
    if (category === 'cuisine') description = "culinary cuisines (e.g. Italian, Thai, Vietnamese)";
    if (category === 'dietary') description = "dietary preferences or restrictions (e.g. Vegan, Keto, Gluten-Free)";
    if (category === 'medical') description = "medical or health conditions relevant to diet (e.g. Iron Deficiency, Celiac Disease, Hypertension)";

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: \`Provide up to 5 standard, correctly-spelled \${description} that match the partial user input: "\${partialText}". Return them as a JSON list of strings.\`,
      config: {
        systemInstruction: "You are an AI assistant helping a user fill out a structured profile. Output only a JSON array of strings containing the suggestions. Keep them concise and standard.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "List of matching suggestions."
        }
      }
    });
    const text = response.text;
    if (!text) return [];
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error in serverSuggestFreeTextOptions:", err);
    return [];
  }
}
`;

code += newFn;
fs.writeFileSync('src/services/geminiServer.ts', code);
console.log("Patched geminiServer.ts");
