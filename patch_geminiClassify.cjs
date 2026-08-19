const fs = require('fs');
let code = fs.readFileSync('src/services/geminiServer.ts', 'utf8');

const newFunction = `
export async function serverClassifyMealType(name: string, ingredients: string[], details: string): Promise<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'> {
  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: \`Classify the following dish into exactly one of these meal types: Breakfast, Lunch, Dinner, or Snack. 
Name: \${name}
Ingredients: \${ingredients.join(', ')}
Details: \${details}\`,
      config: {
        systemInstruction: "You are an AI culinary assistant. Output only a JSON object containing the classified mealType. Do not output markdown or any other text.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealType: {
              type: Type.STRING,
              enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
              description: "The appropriate meal type classification for the dish."
            }
          },
          required: ["mealType"]
        }
      }
    });

    const text = response.text();
    if (!text) throw new Error("No text returned from Gemini");
    
    const parsed = JSON.parse(text);
    return parsed.mealType;
  } catch (err) {
    console.error("Error in serverClassifyMealType:", err);
    throw err;
  }
}
`;

code = code + "\n" + newFunction;

fs.writeFileSync('src/services/geminiServer.ts', code);
console.log("Appended serverClassifyMealType to geminiServer.ts");
