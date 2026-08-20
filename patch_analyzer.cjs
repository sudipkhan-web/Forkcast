const fs = require('fs');
let code = fs.readFileSync('src/services/mealPhotoAnalyzer.ts', 'utf8');

code = code.replace(
  "export async function suggestFreeTextOptions(category: 'cuisine' | 'dietary' | 'medical', partialText: string): Promise<string[]> {",
  "export async function suggestFreeTextOptions(category: 'cuisine' | 'dietary' | 'medical' | 'ingredient' | 'mealName', partialText: string): Promise<string[]> {"
);

fs.writeFileSync('src/services/mealPhotoAnalyzer.ts', code);
