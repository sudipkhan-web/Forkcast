const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// There is still a syntax error near the end. Let's make sure the component is closed properly.
const closing = `      {scannedMealPreview && (
        <MealPhotoConfirmModal
          isOpen={!!scannedMealPreview}
          initialData={scannedMealPreview}
          onConfirm={handleConfirmMealPhoto}
          onCancel={() => setScannedMealPreview(null)}
        />
      )}
    </motion.div>
  );
}`;

if (!code.endsWith(closing)) {
    // If the file is broken, let's just forcefully append the closing logic if it's missing or fix the stray characters.
    const lastValidClosing = code.lastIndexOf("</motion.div>");
    if (lastValidClosing !== -1) {
       code = code.substring(0, lastValidClosing);
       code += closing;
    }
}

fs.writeFileSync('src/views/HomeView.tsx', code);
