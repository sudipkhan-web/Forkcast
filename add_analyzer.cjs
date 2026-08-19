const fs = require('fs');
let code = fs.readFileSync('src/services/mealPhotoAnalyzer.ts', 'utf8');

code += `
export async function estimateMealFromName(name: string): Promise<any> {
  try {
    const res = await fetch("/api/meals/estimate-from-name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || \`Server returned status \${res.status}\`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error estimating meal macros from name:", error);
    throw new Error("Failed to estimate meal macros. Please try again.");
  }
}
`;

fs.writeFileSync('src/services/mealPhotoAnalyzer.ts', code);
