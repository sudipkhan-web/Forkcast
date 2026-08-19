const fs = require('fs');

// 1. Fix geminiServer.ts
let gemini = fs.readFileSync('src/services/geminiServer.ts', 'utf8');
gemini = gemini.replace(
  /console\.warn\("\[SERVER\] Notice during recipe generation \(e\.g\. quota limit\), providing curated recipes:", error\?\.message \|\| error\);/g,
  "// Quota limit expected occasionally; fallback is used quietly."
);
fs.writeFileSync('src/services/geminiServer.ts', gemini);

// 2. Fix imageGenerator.ts
let imageGen = fs.readFileSync('src/services/imageGenerator.ts', 'utf8');
imageGen = imageGen.replace(
  /console\.error\("Failed to generate recipe image:", error\);/g,
  "// Image generation failed (e.g. network error, ad blocker, quota). Using fallback quietly."
);
fs.writeFileSync('src/services/imageGenerator.ts', imageGen);

console.log("Fixed logs");
