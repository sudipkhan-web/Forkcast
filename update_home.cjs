const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const replacement = `<MealPhotoConfirmModal
          isOpen={!!scannedMealPreview || showManualMealModal}
          initialData={scannedMealPreview || null}
          onConfirm={handleConfirmMealPhoto}
          onCancel={() => { setScannedMealPreview(null); setShowManualMealModal(false); }}
          globalRecipes={globalRecipes}
          ALL_MEALS={ALL_MEALS}
        />`;

code = code.replace(/<MealPhotoConfirmModal[\s\S]*?\/>/, replacement);

fs.writeFileSync('src/views/HomeView.tsx', code);
