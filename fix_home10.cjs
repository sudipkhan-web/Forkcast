const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// There's a duplicate `handleConfirmMealPhoto` block AND an extra `};` at the end of `handleMealPhotoUpload`.
// Let's strip the extra bracket and one of the duplicate functions.
code = code.replace("    }\n  };\n  };\n  const handleConfirmMealPhoto = async (data", "    }\n  };\n  const handleConfirmMealPhoto = async (data");

const handleConfirmFn = `  const handleConfirmMealPhoto = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number }) => {
    if (!auth.currentUser || !scannedMealPreview) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
      
      const newMeal = {
        id: crypto.randomUUID(),
        name: data.name,
        calories: data.calories,
        carbsGrams: data.carbsGrams,
        proteinGrams: data.proteinGrams,
        fatGrams: data.fatGrams,
        mealType: 'Snack', // Default to snack
        image: scannedMealPreview.imageBase64,
        source: 'photo-log'
      };
      
      await setDoc(logRef, {
        acceptedMeals: arrayUnion(newMeal)
      }, { merge: true });
      
      showToast(\`Meal logged! Added \${data.name} (\${data.calories} kcal)\`, "success");
      setScannedMealPreview(null);
    } catch (err: any) {
      console.error(err);
      showToast("Failed to save meal log.", "error");
    }
  };`;

// Find all instances of this exact block (accounting for whitespace differences maybe tricky, let's use a simpler check)
const blockSignature = `const handleConfirmMealPhoto = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number }) => {`;

const lines = code.split('\n');
let newLines = [];
let skipBlock = false;
let blockCount = 0;

for (let i = 0; i < lines.length; i++) {
   if (lines[i].includes(blockSignature)) {
      blockCount++;
      if (blockCount > 1) {
         skipBlock = true;
      }
   }
   
   if (skipBlock) {
      if (lines[i].trim() === "};" && !lines[i-1].includes("catch")) {
         skipBlock = false;
      }
   } else {
      newLines.push(lines[i]);
   }
}

code = newLines.join('\n');

// Ensure only one trailing bracket for the component
let endingLines = [];
let foundEnd = false;
for (let i = newLines.length - 1; i >= 0; i--) {
   if (newLines[i].includes("</motion.div>")) {
      endingLines.unshift(newLines[i]);
      endingLines.push("  );");
      endingLines.push("}");
      break;
   }
}

fs.writeFileSync('src/views/HomeView.tsx', code);
