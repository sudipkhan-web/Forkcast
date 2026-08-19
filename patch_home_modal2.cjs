const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// The file might be in a weird state.
// If it has syntax errors, let's just do a clean regex replacement on the exact block.
const uploadBlockRegex = /if \(result && result\.name\) \{\s*\/\/\s*Save to today's log[\s\S]*?if \(e\.target\) e\.target\.value = '';\s*\}/m;

const replacementStr = `if (result && result.name) {
        setScannedMealPreview({
          ...result,
          imageBase64: resizedDataUrl
        });
      } else {
        throw new Error("Could not identify meal");
      }
    } catch (err: any) {
      console.error(err);
      showToast(\`Error: \${err.message || "Failed to analyze photo."}\`, "error");
    } finally {
      setIsScanningMeal(false);
      if (e.target) e.target.value = '';
    }`;

code = code.replace(uploadBlockRegex, replacementStr);
fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Fixed upload block.");
