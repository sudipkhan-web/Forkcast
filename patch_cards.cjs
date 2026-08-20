const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// 1. Update Expand All button IDs
code = code.replace(
  /new Set\(\['skill', 'time', 'cuisines', 'dietary', 'disliked', 'medical', 'race', 'finetune', 'supplements'\]\)/g,
  "new Set(['skill', 'dietary', 'race', 'disliked', 'supplements', 'fueling', 'cookingTime', 'cuisines', 'medical'])"
);

// 2. Fix the accordion pattern for each card

// Helper to convert a card
function convertCard(code, searchTitle, iconStr, headerText, id, hasValueIndicatorStr) {
  // Try to find the section block
  const sectionStart = code.indexOf(`<section className={\`\${CARD} p-6\`}>`, code.indexOf(searchTitle));
  if (sectionStart === -1) {
    console.log("Could not find section for", searchTitle);
    return code;
  }
  const sectionEndStr = `</section>`;
  const sectionEnd = code.indexOf(sectionEndStr, sectionStart);
  if (sectionEnd === -1) return code;
  
  let sectionContent = code.substring(sectionStart, sectionEnd + sectionEndStr.length);
  
  // Extract the inner content after the header
  const headerStart = sectionContent.indexOf(`<div className="flex items-center gap-2 mb-4">`);
  const headerEndStr = `</div>`;
  const headerEnd = sectionContent.indexOf(headerEndStr, headerStart) + headerEndStr.length;
  
  const innerContent = sectionContent.substring(headerEnd, sectionContent.length - sectionEndStr.length).trim();
  
  // Create the new section content
  const newSectionContent = `<div className={\`\${CARD} overflow-hidden\`}>
              <button
                onClick={() => {
                  const newSet = new Set(expandedCards);
                  if (newSet.has('${id}')) newSet.delete('${id}');
                  else newSet.add('${id}');
                  setExpandedCards(newSet);
                }}
                className="w-full flex items-center justify-between p-6 focus:outline-none text-left"
              >
                <div className="flex items-center gap-2">
                  ${iconStr}
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">${headerText}</h2>
                </div>
                <div className="flex items-center gap-3">
                  ${hasValueIndicatorStr}
                  <ChevronRight className={\`w-4 h-4 text-stone-500 transition-transform duration-200 \${expandedCards.has('${id}') ? 'rotate-90' : ''}\`} />
                </div>
              </button>
              <AnimatePresence>
                {expandedCards.has('${id}') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 border-t border-stone-800/50 mt-2 space-y-4">
                      ${innerContent}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>`;
            
  return code.replace(sectionContent, newSectionContent);
}

// 1. Max Cooking Time ('cookingTime')
// Original header: <Clock className="w-4 h-4 text-[#FC5200]" /> and "Max Cooking Time"
code = convertCard(code, "Max Cooking Time", `<Clock className="w-4 h-4 text-[#FC5200]" />`, "Max Cooking Time", "cookingTime", `<span className="text-sm font-medium text-stone-400">{person.maxCookingTime || 'No limit'} min</span>`);

// 2. Favorite Cuisines ('cuisines')
// Original header: <Heart className="w-4 h-4 text-rose-500" /> and "Favorite Cuisines"
code = convertCard(code, "Favorite Cuisines", `<Heart className="w-4 h-4 text-rose-500" />`, "Favorite Cuisines", "cuisines", `<span className="text-sm font-medium text-stone-400">{person.favoriteCuisines?.length > 0 ? \`\${person.favoriteCuisines.length} selected\` : "None"}</span>`);

// 3. Disliked Ingredients ('disliked')
// Original header: <ThumbsDown className="w-4 h-4 text-red-500" /> and "Disliked Ingredients"
code = convertCard(code, "Disliked Ingredients", `<ThumbsDown className="w-4 h-4 text-red-500" />`, "Disliked Ingredients", "disliked", `<span className="text-sm font-medium text-stone-400">{person.dislikedIngredients?.length > 0 ? \`\${person.dislikedIngredients.length} selected\` : "None"}</span>`);

// 4. Medical & Health Conditions ('medical')
// Original header: <Activity className="w-4 h-4 text-blue-500" /> and "Medical & Health Conditions"
code = convertCard(code, "Medical & Health Conditions", `<Activity className="w-4 h-4 text-blue-500" />`, "Medical & Health Conditions", "medical", `<span className="text-sm font-medium text-stone-400">{person.healthConditions?.length > 0 ? \`\${person.healthConditions.length} selected\` : "None"}</span>`);

// 5. Fine-tune your fueling ('fueling')
// Original header: <Zap className="w-4 h-4 text-yellow-500" /> and "Fine-tune your fueling"
// Note: wait, let's search for Fine-tune your fueling
code = convertCard(code, "Fine-tune your fueling", `<Zap className="w-4 h-4 text-yellow-500" />`, "Fine-tune your fueling", "fueling", `<span className="text-sm font-medium text-stone-400">{person.finetuneFueling?.length > 0 ? \`\${person.finetuneFueling.length} selected\` : "None"}</span>`);

// 6. Supplements ('supplements')
// Original header: <Pill className="w-4 h-4 text-purple-500" /> and "Supplements"
code = convertCard(code, "Supplements", `<Pill className="w-4 h-4 text-purple-500" />`, "Supplements", "supplements", `<span className="text-sm font-medium text-stone-400">{person.supplements?.length > 0 ? \`\${person.supplements.length} selected\` : "None"}</span>`);

fs.writeFileSync('src/views/ProfileView.tsx', code);
