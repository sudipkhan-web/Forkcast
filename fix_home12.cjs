const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const regex = /const handleMealPhotoUpload[\s\S]*?const handleConfirmMealPhoto = async/m;
const match = code.match(regex);
if (match) {
    let replaced = match[0].replace(/} catch \(err: any\) \{[\s\S]*?\} finally \{[\s\S]*?if \(e\.target\) e\.target\.value = '';\n    \}\n  \};\n  const handleConfirmMealPhoto = async/m,
    `} catch (err: any) {
      console.error(err);
      showToast(\`Error: \${err.message || "Failed to analyze photo."}\`, "error");
    } finally {
      setIsScanningMeal(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleConfirmMealPhoto = async`);
    
    code = code.replace(match[0], replaced);
    fs.writeFileSync('src/views/HomeView.tsx', code);
    console.log("Replaced!");
}
