const fs = require('fs');
let code = fs.readFileSync('src/services/geminiServer.ts', 'utf8');

// serverClassifyIngredient
code = code.replace(
  /\} catch \(err\) \{\s*console\.error\("Error in serverClassifyIngredient:", err\);\s*throw err;\s*\}/g,
  `} catch (err) {
    console.error("Error in serverClassifyIngredient:", err);
    return {
      location: 'pantry',
      category: 'Other',
      standardizedName: name
    };
  }`
);

// serverClassifyMealType
code = code.replace(
  /\} catch \(err\) \{\s*console\.error\("Error in serverClassifyMealType:", err\);\s*throw err;\s*\}/g,
  `} catch (err) {
    console.error("Error in serverClassifyMealType:", err);
    // fallback based on name or time, but default to 'Dinner' or 'Snack' safely
    return 'Dinner';
  }`
);

fs.writeFileSync('src/services/geminiServer.ts', code);
console.log("Patched geminiServer.ts with fallbacks");
