const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const preloadedImageUrls = new Set<string>();\n\nfunction MainApp() {",
  "const preloadedImageUrls = new Set<string>();\nwindow.isGeneratingBg = false;\nwindow.bgGenerationCount = 0;\n\nfunction MainApp() {"
);

code = code.replace(
  "    isGeneratingBg?: boolean;\n  }",
  "    isGeneratingBg?: boolean;\n    bgGenerationCount?: number;\n  }"
);

// Update Home generation logic
code = code.replace(
  "if (suggestions.length < 8 && !window.isGeneratingBg) {",
  "if (suggestions.length < 8 && !window.isGeneratingBg) {\n        if (window.bgGenerationCount && window.bgGenerationCount >= 3) return;\n        window.bgGenerationCount = (window.bgGenerationCount || 0) + 1;"
);

// Update Refine generation logic
code = code.replace(
  "if (refineSuggestions.length < 8 && !window.isGeneratingBg) {",
  "if (refineSuggestions.length < 8 && !window.isGeneratingBg) {\n        if (window.bgGenerationCount && window.bgGenerationCount >= 3) return;\n        window.bgGenerationCount = (window.bgGenerationCount || 0) + 1;"
);

fs.writeFileSync('src/App.tsx', code);
