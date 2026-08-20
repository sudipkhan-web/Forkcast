const fs = require('fs');
let code = fs.readFileSync('src/services/geminiServer.ts', 'utf8');

code = code.replace(
  "export async function serverSuggestFreeTextOptions(category: 'cuisine' | 'dietary' | 'medical', partialText: string): Promise<string[]> {",
  "export async function serverSuggestFreeTextOptions(category: 'cuisine' | 'dietary' | 'medical' | 'ingredient' | 'mealName', partialText: string): Promise<string[]> {"
);

const newIf = `
    let description = '';
    if (category === 'cuisine') description = "culinary cuisines (e.g. Italian, Thai, Vietnamese)";
    if (category === 'dietary') description = "dietary preferences or restrictions (e.g. Vegan, Keto, Gluten-Free)";
    if (category === 'medical') description = "medical or health conditions relevant to diet (e.g. Iron Deficiency, Celiac Disease, Hypertension)";
    if (category === 'ingredient') description = "standard grocery ingredients or food items (e.g. Garlic, Chicken Breast, Olive Oil)";
    if (category === 'mealName') description = "well-formed dish or meal names (e.g. Spaghetti Bolognese, Chicken Salad)";
`;

code = code.replace(
  /let description = '';[\s\S]*?if \(category === 'medical'\)[^\n]*\n/,
  newIf
);

fs.writeFileSync('src/services/geminiServer.ts', code);
