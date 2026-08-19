const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

const replacement = `<MealPhotoConfirmModal
          isOpen={!!manualMealDate}
          initialData={null}
          initialDate={manualMealDate}
          onConfirm={handleConfirmManualMeal}
          onCancel={() => setManualMealDate(null)}
          globalRecipes={globalRecipes}
          ALL_MEALS={ALL_MEALS}
        />`;

code = code.replace(/<MealPhotoConfirmModal[\s\S]*?\/>/, replacement);

fs.writeFileSync('src/views/PlanView.tsx', code);
