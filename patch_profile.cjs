const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// Add toast and getDocs/query/where/collection/updateDoc if needed
if (!code.includes("import toast")) {
  code = code.replace(
    /import { doc, setDoc } from 'firebase\/firestore';/,
    "import { doc, setDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';\nimport toast from 'react-hot-toast';"
  );
}

// Add state for loading
if (!code.includes("const [isFixingMealTypes")) {
  code = code.replace(
    /const \[showAddPersonModal, setShowAddPersonModal\] = useState\(false\);/,
    "const [showAddPersonModal, setShowAddPersonModal] = useState(false);\n  const [isFixingMealTypes, setIsFixingMealTypes] = useState(false);"
  );
}

// Add button logic
const fixButtonHTML = `
              <div className="mt-6 border-t border-stone-800 pt-6">
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                  <span className="text-yellow-500">⚠️</span> One-time: Re-check Meal Type Labels
                </h3>
                <p className="text-xs text-stone-400 mb-4">
                  Fixes old recipes mislabeled before a bug fix. Run once, then this button should be removed.
                </p>
                <button
                  disabled={isFixingMealTypes}
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to run the meal type data fix?")) return;
                    setIsFixingMealTypes(true);
                    const loadingToast = toast.loading("Fetching recipes to check...");
                    try {
                      const q = query(collection(db, 'recipes'), where('mealType', '==', 'Dinner'));
                      const snapshot = await getDocs(q);
                      const docs = snapshot.docs;
                      
                      if (docs.length === 0) {
                        toast.success("No recipes found with mealType 'Dinner' to check.", { id: loadingToast });
                        setIsFixingMealTypes(false);
                        return;
                      }

                      toast.loading(\`Checking \${docs.length} recipes in batches...\`, { id: loadingToast });
                      
                      let fixedCount = 0;
                      const BATCH_SIZE = 4;
                      for (let i = 0; i < docs.length; i += BATCH_SIZE) {
                        const batch = docs.slice(i, i + BATCH_SIZE);
                        const promises = batch.map(async (recipeDoc) => {
                          const data = recipeDoc.data();
                          try {
                            const response = await fetch('/api/recipes/classify-mealtype', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                name: data.name,
                                ingredients: data.ingredients?.map((ing) => ing.name) || [],
                                details: data.details || ''
                              })
                            });
                            if (!response.ok) throw new Error("Classification failed");
                            const { mealType } = await response.json();
                            if (mealType && mealType !== 'Dinner') {
                              await updateDoc(doc(db, 'recipes', recipeDoc.id), { mealType });
                              return 1;
                            }
                            return 0;
                          } catch (err) {
                            console.error(\`Failed to classify \${data.name}:\`, err);
                            return 0;
                          }
                        });

                        const results = await Promise.all(promises);
                        fixedCount += results.reduce((sum, count) => sum + count, 0);
                      }

                      toast.success(\`Fixed \${fixedCount} of \${docs.length} checked.\`, { id: loadingToast });
                    } catch (err) {
                      console.error("Error fixing meal types:", err);
                      toast.error("Failed to run meal type fix", { id: loadingToast });
                    } finally {
                      setIsFixingMealTypes(false);
                    }
                  }}
                  className={\`w-full py-3 rounded-xl text-sm font-bold transition-all \${isFixingMealTypes ? 'bg-stone-800 text-stone-500' : 'bg-stone-800 text-yellow-500 hover:bg-stone-700'}\`}
                >
                  {isFixingMealTypes ? 'Checking recipes...' : 'Re-check Meal Types'}
                </button>
              </div>
`;

code = code.replace(
  /alert\('Pre-population complete!'\);\s*\}\s*catch[^{]+\{[^}]+\}\s*\}\}\s*className="w-full[^>]+>\s*Pre-Populate Database\s*<\/button>/,
  (match) => match + "\n" + fixButtonHTML
);


fs.writeFileSync('src/views/ProfileView.tsx', code);
console.log("Updated ProfileView.tsx");
