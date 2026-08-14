const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The initial refresh for home:
code = code.replace(
  "    const missingCount = 50 - suggestions.length;\n    if (missingCount <= 0 && suggestions.length > 0) return;\n    \n    // We only want to fill what's missing, mostly this effect runs when starting or changing groups\n    const topMeals = getTopMeals(50 - suggestions.length",
  "    const missingCount = 20 - suggestions.length;\n    if (missingCount <= 0 && suggestions.length > 0) return;\n    \n    // We only want to fill what's missing, mostly this effect runs when starting or changing groups\n    const topMeals = getTopMeals(20 - suggestions.length"
);

// replace slice(0, 50) for Home refresh
code = code.replace(
  "return [...prev, ...newItems].slice(0, 50);",
  "return [...prev, ...newItems].slice(0, 20);"
);

// Home Declarative background queue
code = code.replace(
  "  // Declaratively maintain the 50-item background queue\n  React.useEffect(() => {\n    if (!hasLoadedSuggestions) return; // Only process when fully loaded\n    \n    const shortfall = 50 - suggestions.length;",
  "  // Declaratively maintain the 20-item background queue\n  React.useEffect(() => {\n    if (!hasLoadedSuggestions) return; // Only process when fully loaded\n    \n    const shortfall = 20 - suggestions.length;"
);
// Home fallback generation threshold
code = code.replace(
  "if (suggestions.length < 20 && !window.isGeneratingBg)",
  "if (suggestions.length < 8 && !window.isGeneratingBg)"
);

// Home generation slice
code = code.replace(
  "return updated.slice(0, 50);",
  "return updated.slice(0, 20);"
);

// Refine Declarative background queue
code = code.replace(
  "  // Declaratively maintain the 50-item refine queue (TasteLearningScreen)\n  React.useEffect(() => {\n    if (!hasLoadedSuggestions) return;\n    \n    const shortfall = 50 - refineSuggestions.length;",
  "  // Declaratively maintain the 20-item refine queue (TasteLearningScreen)\n  React.useEffect(() => {\n    if (!hasLoadedSuggestions) return;\n    \n    const shortfall = 20 - refineSuggestions.length;"
);

// Refine fallback generation threshold
code = code.replace(
  "if (refineSuggestions.length < 20 && !window.isGeneratingBg)",
  "if (refineSuggestions.length < 8 && !window.isGeneratingBg)"
);

fs.writeFileSync('src/App.tsx', code);
