const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const refineOld = `      {/* Refine Tab */}
      <AnimatePresence>
        {activeTab === 'refine' && (
          <TasteLearningScreen 
            onClose={() => setActiveTab('home')}
            onOpenFavorites={() => setActiveTab('favorites')}
            onFavoriteMeal={async (meal) => {
              if (!favorites.find(f => f.id === meal.id)) {
                setFavorites([...favorites, meal]);
                if (auth.currentUser) await setDoc(doc(db, 'users', auth.currentUser.uid, 'favorites', meal.id), meal);
              }
            }}
          />
        )}
      </AnimatePresence>`;

const learningBlockStart = "      {/* Taste Learning Tab */}";

const learningBlock = content.split("      {/* Taste Learning Tab */}")[1].split("      {/* Details View */}")[0];
const newRefineBlock = `      {/* Refine Tab */}` + learningBlock.replace("activeTab === 'learning'", "activeTab === 'refine'");

if (content.includes(refineOld)) {
  content = content.replace(refineOld, newRefineBlock);
} else {
  console.log("Could not find refine block to replace");
}

fs.writeFileSync('src/App.tsx', content);
