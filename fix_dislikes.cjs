const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const badBlock = `              <button
                onClick={() => {
                  const newSet = new Set(expandedCards);
                  if (newSet.has('cuisines')) newSet.delete('cuisines');
                  else newSet.add('cuisines');
                  setExpandedCards(newSet);
                }}
                className="w-full flex items-center justify-between p-6 focus:outline-none text-left"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Favorite Cuisines</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-400">{person.favoriteCuisines?.length > 0 ? \`\${person.favoriteCuisines.length} selected\` : "None"}</span>
                  <ChevronRight className={\`w-4 h-4 text-stone-500 transition-transform duration-200 \${expandedCards.has('cuisines') ? 'rotate-90' : ''}\`} />
                </div>
              </button>
              <AnimatePresence>
                {expandedCards.has('cuisines') && (`;

const fixedBlock = `              <button
                onClick={() => {
                  const newSet = new Set(expandedCards);
                  if (newSet.has('disliked')) newSet.delete('disliked');
                  else newSet.add('disliked');
                  setExpandedCards(newSet);
                }}
                className="w-full flex items-center justify-between p-6 focus:outline-none text-left"
              >
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4 text-red-500" />
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Disliked Ingredients</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-400">{person.dislikedIngredients?.length > 0 ? \`\${person.dislikedIngredients.length} selected\` : "None"}</span>
                  <ChevronRight className={\`w-4 h-4 text-stone-500 transition-transform duration-200 \${expandedCards.has('disliked') ? 'rotate-90' : ''}\`} />
                </div>
              </button>
              <AnimatePresence>
                {expandedCards.has('disliked') && (`;

if (code.includes(badBlock)) {
  code = code.replace(badBlock, fixedBlock);
  fs.writeFileSync('src/views/ProfileView.tsx', code);
  console.log("Successfully fixed the Disliked Ingredients accordion");
} else {
  console.log("Could not find the target string.");
}
