const fs = require('fs');
let code = fs.readFileSync('src/services/geminiServer.ts', 'utf8');

const newFunc = `
export async function serverClassifyIngredient(name: string): Promise<{ location: 'fridge' | 'pantry', category: 'Produce' | 'Dairy & Eggs' | 'Meat & Seafood' | 'Pantry Staples' | 'Snacks' | 'Beverages' | 'Frozen' | 'Spices & Seasonings' | 'Other' }> {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: \`Classify the following ingredient: "\${name}". Give its most common storage location (fridge or pantry) and category.\`,
      config: {
        systemInstruction: "You are an AI culinary assistant. Output only a JSON object containing the location and category. Do not output markdown or any other text.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            location: {
              type: Type.STRING,
              enum: ['fridge', 'pantry'],
              description: "The common storage location."
            },
            category: {
              type: Type.STRING,
              enum: ['Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Pantry Staples', 'Snacks', 'Beverages', 'Frozen', 'Spices & Seasonings', 'Other'],
              description: "The food category."
            }
          },
          required: ["location", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    
    const parsed = JSON.parse(text);
    return parsed;
  } catch (err) {
    console.error("Error in serverClassifyIngredient:", err);
    throw err;
  }
}
`;

code += "\n" + newFunc;
fs.writeFileSync('src/services/geminiServer.ts', code);
