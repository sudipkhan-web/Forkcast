const fs = require('fs');
let code = fs.readFileSync('src/services/recipeGenerator.ts', 'utf8');

const oldCheck = `    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || \`Server returned status \${res.status}\`);
    }`;

const newCheck = `    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || \`Server returned status \${res.status}\`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      // it's JSON
    } else {
      throw new Error("Received non-JSON response from server. Please try again.");
    }`;

if (code.includes(oldCheck)) {
  code = code.replace(oldCheck, newCheck);
  fs.writeFileSync('src/services/recipeGenerator.ts', code);
  console.log("Patched recipeGenerator.ts successfully.");
} else {
  console.log("Could not find the target code in recipeGenerator.ts");
}
