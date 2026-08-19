const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// The modal code got duplicated at the end during the previous regex failure. Let's strip the double block.
const duplicateModalBlock = `      {scannedMealPreview && (
        <MealPhotoConfirmModal
          isOpen={!!scannedMealPreview}
          initialData={scannedMealPreview}
          onConfirm={handleConfirmMealPhoto}
          onCancel={() => setScannedMealPreview(null)}
        />
      )}`;

if (code.includes(duplicateModalBlock)) {
  const index = code.lastIndexOf(duplicateModalBlock);
  if (index !== -1) {
    code = code.substring(0, index) + code.substring(index + duplicateModalBlock.length);
  }
}

// Remove duplicate imports at top
code = code.replace(
  "import { arrayUnion } from 'firebase/firestore';\nimport { MealPhotoConfirmModal } from '../components/MealPhotoConfirmModal';\nimport { arrayUnion } from 'firebase/firestore';\nimport { MealPhotoConfirmModal } from '../components/MealPhotoConfirmModal';",
  "import { arrayUnion } from 'firebase/firestore';\nimport { MealPhotoConfirmModal } from '../components/MealPhotoConfirmModal';"
);

fs.writeFileSync('src/views/HomeView.tsx', code);
