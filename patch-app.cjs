const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update activeTab type
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'home' | 'inventory' | 'shopping' | 'learning' | 'profile' | 'plan' | 'favorites'>('home');",
  "const [activeTab, setActiveTab] = useState<'home' | 'inventory' | 'shopping' | 'learning' | 'profile' | 'plan' | 'favorites' | 'progress' | 'refine'>('home');"
);

// Add Refine button in bottom nav
const oldNavBtn = `<button 
            onClick={() => setActiveTab('profile')}
            className={\`flex flex-col items-center justify-center p-2 min-w-[56px] transition-all active:scale-[0.98] \${activeTab === 'profile' ? 'text-[#FC5200]' : 'text-stone-400 hover:text-white'}\`}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Chef</span>
          </button>`;
          
const newNavBtn = `<button 
            onClick={() => setActiveTab('refine')}
            className={\`flex flex-col items-center justify-center p-2 min-w-[56px] transition-all active:scale-[0.98] \${activeTab === 'refine' ? 'text-[#FC5200]' : 'text-stone-400 hover:text-white'}\`}
          >
            <Compass className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Refine</span>
          </button>`;

if (content.includes(oldNavBtn)) {
  content = content.replace(oldNavBtn, newNavBtn);
} else {
  console.log("Could not find old nav button");
}

const newBlock = `      {/* Refine Tab */}
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

// Insert the new block before the Home tab block for consistency, or just after the learning tab
content = content.replace(
  "{/* Taste Learning Tab */}",
  newBlock + "\n\n      {/* Taste Learning Tab */}"
);

fs.writeFileSync('src/App.tsx', content);
