const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

code = code.replace(
  "import { analyzeMealPhoto } from '../services/mealPhotoAnalyzer';",
  "import { captureMealPhoto } from '../services/mealPhotoAnalyzer';"
);

const oldFuncRegex = /const handleMealPhotoUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?if \(e\.target\) e\.target\.value = '';\n    \}\n  \};/;

const newFunc = `const handleMealPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningMeal(true);
    try {
      const result = await captureMealPhoto(file);
      if (result) {
        setScannedMealPreview(result);
      } else {
        showToast("Error: Failed to analyze photo.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast(\`Error: \${err.message || "Failed to analyze photo."}\`, "error");
    } finally {
      setIsScanningMeal(false);
      if (e.target) e.target.value = '';
    }
  };`;

code = code.replace(oldFuncRegex, newFunc);
fs.writeFileSync('src/views/HomeView.tsx', code);
