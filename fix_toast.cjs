const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

code = code.replace(
  'showToast({ title: "Meal logged!", message: `Added ${result.name} (${result.calories} kcal)`, type: "success" });',
  'showToast(`Meal logged! Added ${result.name} (${result.calories} kcal)`, "success");'
);

code = code.replace(
  'showToast({ title: "Error scanning meal", message: err.message || "Failed to analyze photo.", type: "error" });',
  'showToast(`Error: ${err.message || "Failed to analyze photo."}`, "error");'
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Fixed Toast calls in HomeView");
