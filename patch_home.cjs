const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// Add manual modal state
if (!code.includes("showManualMealModal")) {
  code = code.replace(
    /const \[scannedMealPreview, setScannedMealPreview\] = useState<any \| null>\(null\);/,
    "const [scannedMealPreview, setScannedMealPreview] = useState<any | null>(null);\n  const [showManualMealModal, setShowManualMealModal] = useState(false);"
  );
}

// Update handleConfirmMealPhoto to use data.date
code = code.replace(
  /const handleConfirmMealPhoto = async \(data: \{ name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' \| 'Lunch' \| 'Dinner' \| 'Snack' \}\) => \{/,
  "const handleConfirmMealPhoto = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; date: string }) => {"
);

code = code.replace(
  /const today = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];\n\s*const logRef = doc\(db, `users\/\$\{auth\.currentUser\.uid\}\/trainingLog`, today\);/,
  "const logRef = doc(db, `users/${auth.currentUser?.uid}/trainingLog`, data.date);"
);

// Close manual modal on success
code = code.replace(
  /setScannedMealPreview\(null\);/,
  "setScannedMealPreview(null);\n      setShowManualMealModal(false);"
);

// Add the "+ Add meal manually" button next to "Log a meal"
const manualBtnHTML = `
        <div className="flex flex-col items-center gap-3 w-full">
          <label className="\${PRIMARY_BUTTON} w-full py-4 text-lg font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#FC5200]/20">
            <Camera className="w-5 h-5" />
            {isScanningMeal ? 'Analyzing...' : 'Log a meal'}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleScanMeal}
              disabled={isScanningMeal}
            />
          </label>
          <button 
            onClick={() => setShowManualMealModal(true)}
            className="text-sm font-medium text-stone-400 hover:text-white transition-colors"
          >
            + Add meal manually
          </button>
        </div>
`;

code = code.replace(
  /<label className=\{\`\$\{PRIMARY_BUTTON\} w-full py-4 text-lg font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-\[\#FC5200\]\/20\`\}>[\s\S]*?<\/label>/,
  manualBtnHTML
);

// Render modal for manual entry too
code = code.replace(
  /\{scannedMealPreview && \(/,
  "{(scannedMealPreview || showManualMealModal) && ("
);

code = code.replace(
  /isOpen=\{!!scannedMealPreview\}/,
  "isOpen={!!scannedMealPreview || showManualMealModal}"
);

code = code.replace(
  /initialData=\{scannedMealPreview\}/,
  "initialData={scannedMealPreview || null}"
);

code = code.replace(
  /onCancel=\{\(\) => setScannedMealPreview\(null\)\}/,
  "onCancel={() => { setScannedMealPreview(null); setShowManualMealModal(false); }}"
);


fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Updated HomeView.tsx");
