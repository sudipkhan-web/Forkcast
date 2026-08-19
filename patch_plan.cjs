const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// Add imports
code = code.replace(
  "import { Plus, Trash2 } from 'lucide-react';",
  "import { Plus, Trash2, Camera, Loader2 } from 'lucide-react';\nimport { captureMealPhoto } from '../services/mealPhotoAnalyzer';\nimport { useToast } from '../components/Toast';"
);

// Add hooks
code = code.replace(
  "const [manualMealDate, setManualMealDate] = React.useState<string | null>(null);",
  `const [manualMealDate, setManualMealDate] = React.useState<string | null>(null);
  const [scanningDate, setScanningDate] = React.useState<string | null>(null);
  const [scannedMealPreview, setScannedMealPreview] = React.useState<any | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeDateForUpload, setActiveDateForUpload] = React.useState<string | null>(null);
  const { showToast } = useToast();`
);

// Add triggerUpload and handlePhotoUpload functions
const handlePhotoUploadCode = `
  const triggerUpload = (dateKey: string) => {
    setActiveDateForUpload(dateKey);
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeDateForUpload) return;

    setScanningDate(activeDateForUpload);
    try {
      const result = await captureMealPhoto(file);
      if (result) {
        setScannedMealPreview(result);
        setManualMealDate(activeDateForUpload);
      } else {
        showToast("Error: Failed to analyze photo.", "error");
      }
    } catch (err: any) {
      showToast(\`Error: \${err.message || "Failed to analyze photo."}\`, "error");
    } finally {
      setScanningDate(null);
      setActiveDateForUpload(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteLoggedMeal =`;

code = code.replace("  const handleDeleteLoggedMeal =", handlePhotoUploadCode);

// Update handleConfirmManualMeal to include image and source
code = code.replace(
  "mealType: data.mealType,",
  "mealType: data.mealType,\n            image: scannedMealPreview?.imageBase64 || null,\n            source: scannedMealPreview ? 'photo-log' : 'manual-log',"
);

// Add hidden file input at the top of History view
const hiddenInputCode = `
        <div className="flex flex-col gap-6">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
          />`;
code = code.replace('<div className="flex flex-col gap-6">', hiddenInputCode);

// Add Camera button next to Plus button
const cameraBtnCode = `
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => triggerUpload(dateKey)}
                                className="p-1 text-stone-400 hover:text-[#FC5200] transition-colors disabled:opacity-50"
                                disabled={scanningDate === dateKey}
                              >
                                {scanningDate === dateKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => setManualMealDate(dateKey)}
                                className="p-1 text-stone-400 hover:text-white transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>`;

code = code.replace(
  `                            <button 
                              onClick={() => setManualMealDate(dateKey)}
                              className="p-1 text-stone-400 hover:text-white transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>`,
  cameraBtnCode
);

// Update MealPhotoConfirmModal props
code = code.replace(
  "initialData={null}",
  "initialData={scannedMealPreview}"
);
code = code.replace(
  "onCancel={() => setManualMealDate(null)}",
  "onCancel={() => {\n            setManualMealDate(null);\n            setScannedMealPreview(null);\n          }}"
);

fs.writeFileSync('src/views/PlanView.tsx', code);
