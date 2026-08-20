const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const target = `                  <div className={\`\${CARD} overflow-hidden\`}>
              <button
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

const replacement = `                  <div className={\`\${CARD} overflow-hidden\`}>
              <button
                onClick={() => {
                  const newSet = new Set(expandedCards);
                  if (newSet.has('members')) newSet.delete('members');
                  else newSet.add('members');
                  setExpandedCards(newSet);
                }}
                className="w-full flex items-center justify-between p-6 focus:outline-none text-left"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Members</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-400">{group.memberIds?.length > 0 ? \`\${group.memberIds.length} selected\` : "None"}</span>
                  <ChevronRight className={\`w-4 h-4 text-stone-500 transition-transform duration-200 \${expandedCards.has('members') ? 'rotate-90' : ''}\`} />
                </div>
              </button>
              <AnimatePresence>
                {expandedCards.has('members') && (`;

if(code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/views/ProfileView.tsx', code);
  console.log("Fixed profile view members block");
} else {
  console.log("Could not find target in ProfileView.tsx");
}
