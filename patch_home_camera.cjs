const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// 1. Imports
code = code.replace(
  "CheckCircle2, Circle } from 'lucide-react';",
  "CheckCircle2, Circle, Camera, Loader2 } from 'lucide-react';"
);
code = code.replace(
  "import { getTodayMacros } from '../utils/progressUtils';",
  "import { getTodayMacros } from '../utils/progressUtils';\nimport { analyzeMealPhoto } from '../services/mealPhotoAnalyzer';"
);

// 2. Add state & refs
const stateLine = "  const [mealTypeFilter, setMealTypeFilter] = React.useState<string>('All');";
code = code.replace(
  stateLine,
  stateLine + "\n  const fileInputRef = React.useRef<HTMLInputElement>(null);\n  const [isScanningMeal, setIsScanningMeal] = React.useState(false);"
);

// 3. Add handleMealPhotoUpload
const handlerStr = `
  const handleMealPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningMeal(true);
    try {
      const rawDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (err) => reject(err);
        img.src = rawDataUrl;
      });

      const maxDim = 1600;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const parts = resizedDataUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const finalMime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const base64Data = parts[1];

      const result = await analyzeMealPhoto(base64Data, finalMime);
      
      if (result && result.name) {
        // Save to today's log
        if (auth.currentUser) {
          const today = new Date().toISOString().split('T')[0];
          const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
          
          const newMeal = {
            id: \`ai-scan-\${Date.now()}\`,
            name: result.name,
            calories: result.calories || 0,
            carbsGrams: result.carbsGrams || 0,
            proteinGrams: result.proteinGrams || 0,
            fatGrams: result.fatGrams || 0,
            mealType: 'Snack', // Default to snack
            image: resizedDataUrl
          };
          
          const currentLog = await getDoc(logRef);
          const currentMeals = currentLog.exists() ? (currentLog.data().acceptedMeals || []) : [];
          await setDoc(logRef, { acceptedMeals: [...currentMeals, newMeal] }, { merge: true });
          
          showToast({ title: "Meal logged!", message: \`Added \${result.name} (\${result.calories} kcal)\`, type: "success" });
        }
      } else {
        throw new Error("Could not identify meal");
      }
    } catch (err: any) {
      console.error(err);
      showToast({ title: "Error scanning meal", message: err.message || "Failed to analyze photo.", type: "error" });
    } finally {
      setIsScanningMeal(false);
      if (e.target) e.target.value = '';
    }
  };
`;

code = code.replace(
  "  const handleUpdateFeeling = async",
  handlerStr + "\n  const handleUpdateFeeling = async"
);

// 4. Add the button to UI
const buttonUI = `
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-semibold text-stone-300">Log a meal</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleMealPhotoUpload} 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanningMeal}
              className="px-3 py-1.5 bg-[#FC5200] hover:bg-orange-600 rounded-lg text-[10px] font-bold text-white transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-1"
            >
              {isScanningMeal ? (
                <><Loader2 className="w-3 h-3 animate-spin" /> Scanning</>
              ) : (
                <><Camera className="w-3 h-3" /> Scan</>
              )}
            </button>
          </div>
        </div>
`;

code = code.replace(
  '<div className="flex items-center justify-between w-full">\n          <div className="flex items-center gap-2">\n            <Droplet',
  buttonUI + '\n        <div className="flex items-center justify-between w-full">\n          <div className="flex items-center gap-2">\n            <Droplet'
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Updated HomeView.tsx");
