const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const findCard = (startStr, endStr) => {
    const startIdx = code.indexOf(startStr);
    if (startIdx === -1) return null;
    const endIdx = code.indexOf(endStr, startIdx);
    if (endIdx === -1) return null;
    return {
        start: startIdx,
        end: endIdx + endStr.length,
        content: code.substring(startIdx, endIdx + endStr.length)
    };
};

const makeAccordionCard = (id, icon, title, summaryCode, originalContentStr) => {
    let innerContent = originalContentStr.replace(/^<section className=\{`\$\{CARD\} p-6`\}>\n?/, '');
    innerContent = innerContent.replace(/<\/section>$/, '');
    // Some headers use `mb-2` or `mb-4`.
    innerContent = innerContent.replace(/<div className="flex items-center gap-2 mb-[24]">[\s\S]*?<\/div>\n?/, '');
    // specific fallback:
    innerContent = innerContent.replace(/<div className="flex items-center gap-2 mb-4">\s*<.*? className="w-4 h-4 text-\[#FC5200\]" \/>\s*<h2.*?>.*?<\/h2>\s*<\/div>/, '');
    innerContent = innerContent.replace(/<div className="flex items-center gap-2 mb-2">\s*<.*? className="w-4 h-4 text-\[#FC5200\]" \/>\s*<h2.*?>.*?<\/h2>\s*<\/div>/, '');
    
    return `            <div className={\`\${CARD} overflow-hidden\`}>
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
                  ${icon}
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">${title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-400">${summaryCode}</span>
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
                      ${innerContent.trim()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>`;
}

// 1. Skill Level
const sSkill = findCard(
  '<section className={`${CARD} p-6`}>\n              <div className="flex items-center gap-2 mb-4">\n                <ChefHat className="w-4 h-4 text-[#FC5200]" />\n                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Cooking Skill Level</h2>',
  '</section>'
);
if (sSkill) {
  code = code.replace(sSkill.content, makeAccordionCard('skill', '<ChefHat className="w-4 h-4 text-[#FC5200]" />', 'Cooking Skill Level', '{person.skillLevel}', sSkill.content));
}

// 2. Max Time
const sTime = findCard(
  '<section className={`${CARD} p-6`}>\n              <div className="flex items-center gap-2 mb-4">\n                <Clock className="w-4 h-4 text-[#FC5200]" />\n                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Max Cooking Time</h2>',
  '</section>'
);
if (sTime) {
  code = code.replace(sTime.content, makeAccordionCard('time', '<Clock className="w-4 h-4 text-[#FC5200]" />', 'Max Cooking Time', '{person.maxCookingTime} min', sTime.content));
}

// 3. Cuisines
const sCuisines = findCard(
  '<section className={`${CARD} p-6`}>\n              <div className="flex items-center gap-2 mb-4">\n                <Heart className="w-4 h-4 text-[#FC5200]" />\n                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Favorite Cuisines</h2>',
  '</section>'
);
if (sCuisines) {
  code = code.replace(sCuisines.content, makeAccordionCard('cuisines', '<Heart className="w-4 h-4 text-[#FC5200]" />', 'Favorite Cuisines', '{person.favoriteCuisines.length > 0 ? `${person.favoriteCuisines.length} selected` : "None"}', sCuisines.content));
}

// 4. Dietary
const sDietary = findCard(
  '<section className={`${CARD} p-6`}>\n                    <div className="flex items-center gap-2 mb-4">\n                      <Leaf className="w-4 h-4 text-[#FC5200]" />\n                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Dietary Preferences</h2>',
  '</section>'
);
if (sDietary) {
  code = code.replace(sDietary.content, makeAccordionCard('dietary', '<Leaf className="w-4 h-4 text-[#FC5200]" />', 'Dietary Preferences', '{person.dietary.length > 0 ? `${person.dietary.length} selected` : "None"}', sDietary.content));
}

// 5. Disliked
const sDisliked = findCard(
  '<section className={`${CARD} p-6`}>\n                    <div className="flex items-center gap-2 mb-4">\n                      <Ban className="w-4 h-4 text-[#FC5200]" />\n                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Disliked Ingredients</h2>',
  '</section>'
);
if (sDisliked) {
  code = code.replace(sDisliked.content, makeAccordionCard('disliked', '<Ban className="w-4 h-4 text-[#FC5200]" />', 'Disliked Ingredients', '{person.dislikedIngredients.length > 0 ? `${person.dislikedIngredients.length} selected` : "None"}', sDisliked.content));
}

// 6. Medical
const sMedical = findCard(
  '<section className={`${CARD} p-6`}>\n                    <div className="flex items-center gap-2 mb-2">\n                      <Target className="w-4 h-4 text-[#FC5200]" />\n                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Medical & Health Conditions</h2>',
  '</section>'
);
if (sMedical) {
  code = code.replace(sMedical.content, makeAccordionCard('medical', '<Target className="w-4 h-4 text-[#FC5200]" />', 'Medical & Health Conditions', '{(person.healthConditions || []).length > 0 ? `${(person.healthConditions || []).length} conditions` : "None"}', sMedical.content));
}

// 7. Race
const sRace = findCard(
  '<section className={`${CARD} p-6`}>\n              <div className="flex items-center gap-2 mb-4">\n                <Activity className="w-4 h-4 text-[#FC5200]" />\n                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Race & Training Profile</h2>',
  '</section>'
);
if (sRace) {
  code = code.replace(sRace.content, makeAccordionCard('race', '<Activity className="w-4 h-4 text-[#FC5200]" />', 'Race & Training Profile', '{person.raceType || "None"}', sRace.content));
}

// 8. Finetune
const sFinetune = findCard(
  '<section className={`${CARD} p-6 relative overflow-hidden`}>\n              {(!person.raceType || person.raceType === \'Not training for a race\') && (\n                <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-[1px] z-10 flex items-center justify-center p-6 text-center">\n                  <p className="text-sm font-bold text-stone-300">\n                    Set an upcoming race type above to unlock granular fueling macros.\n                  </p>\n                </div>\n              )}\n              <div className="flex items-center gap-2 mb-4">\n                <Sparkles className="w-4 h-4 text-[#FC5200]" />\n                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Fine-tune your fueling</h2>',
  '</section>'
);
if (sFinetune) {
  code = code.replace(sFinetune.content, makeAccordionCard('finetune', '<Sparkles className="w-4 h-4 text-[#FC5200]" />', 'Fine-tune your fueling', '{(person.carbBaseMultiplier || 1.2) + "x / " + (person.proteinMultiplier || 1.6) + "x"}', sFinetune.content));
}

// 9. Supplements
const sSupplements = findCard(
  '<section className={`${CARD} p-6`}>\n              <div className="flex items-center gap-2 mb-2"> \n                <Activity className="w-4 h-4 text-[#FC5200]" />\n                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Supplements</h2>',
  '</section>'
);
if (sSupplements) {
  code = code.replace(sSupplements.content, makeAccordionCard('supplements', '<Activity className="w-4 h-4 text-[#FC5200]" />', 'Supplements', '{(person.trackedSupplements || []).length > 0 ? `${(person.trackedSupplements || []).length} tracked` : "None"}', sSupplements.content));
}

fs.writeFileSync('src/views/ProfileView.tsx', code);
console.log("Successfully replaced cards");
