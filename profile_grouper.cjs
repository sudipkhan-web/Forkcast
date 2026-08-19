const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// We need to parse the 9 sections correctly and wrap them in 3 larger sections.
const dietaryIndex = code.indexOf('<section className={`${CARD} p-6`}>\n                    <div className="flex items-center gap-2 mb-4">\n                      <Leaf className="w-4 h-4 text-[#FC5200]" />\n                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Dietary Preferences</h2>');

const groupEndIndex = code.indexOf('                  {household.length > 1 && (', dietaryIndex);

const content = code.substring(dietaryIndex, groupEndIndex);

// Let's find the boundaries of each section by splitting on `<section` and restoring it.
const sections = content.split(/<section /g).filter(s => s.trim().length > 0).map(s => '<section ' + s);

// Verify what the sections are
const names = sections.map((s, i) => {
    const titleMatch = s.match(/<h2.*?>(.*?)<\/h2>/);
    return titleMatch ? titleMatch[1] : `Section ${i}`;
});
console.log("Sections found:", names);

// Expected order of original sections:
// 1. Dietary Preferences
// 2. Disliked Ingredients
// 3. Race & Training Profile
// 4. Supplements
// 5. Fine-tune your fueling
// 6. Cooking Skill Level
// 7. Max Cooking Time
// 8. Favorite Cuisines
// 9. Medical & Health Conditions

// Let's identify the specific sections based on title match
const getSec = (namePart) => sections.find(s => s.includes(namePart));

const sDietary = getSec('Dietary Preferences');
const sDisliked = getSec('Disliked Ingredients');
const sMedical = getSec('Medical & Health Conditions');

const sCookingSkill = getSec('Cooking Skill Level');
const sMaxCook = getSec('Max Cooking Time');
const sFavCuisines = getSec('Favorite Cuisines');

const sRace = getSec('Race & Training Profile');
const sFineTune = getSec('Fine-tune your fueling');
const sSupplements = getSec('Supplements');

if (!sDietary || !sDisliked || !sMedical || !sCookingSkill || !sMaxCook || !sFavCuisines || !sRace || !sFineTune || !sSupplements) {
    console.error("Missing one or more sections!");
    process.exit(1);
}

// Ensure the classNames of the sections inside the groups are consistent if they were merged before.
// We'll replace their `<section className="...">` with `<div className={\`\${CARD} p-6\`}>` if they were something else, or keep them as CARDS.
// The prompt says: "Do not change any of the existing field logic, handlers, or individual card contents — this is purely a grouping and default-visibility change around the cards that already exist."
// However, previously some sections might have had `pt-6 border-t` inside a bigger card.
// Let's clean up their root tags to be standalone CARDS if they aren't already.

const normalizeCard = (html) => {
    // If it's a `<section className="pt-6 border-t border-stone-800">`
    return html.replace(/<section className="pt-6 border-t border-stone-800">/, '<section className={`${CARD} p-6`}>')
               .replace(/<section className="pt-4 mt-2 border-t border-stone-800">/, '<section className={`${CARD} p-6`}>');
};

const cookingGroup = `
                  <div className="mt-8 mb-4">
                    <h2 className="text-xs text-[#FC5200] uppercase tracking-widest font-bold">Cooking Preferences</h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    ${normalizeCard(sCookingSkill)}
                    ${normalizeCard(sMaxCook)}
                    ${normalizeCard(sFavCuisines)}
                  </div>
`;

const dietaryGroup = `
                  <div className="mt-8 mb-4">
                    <h2 className="text-xs text-[#FC5200] uppercase tracking-widest font-bold">Dietary & Health</h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    ${normalizeCard(sDietary)}
                    ${normalizeCard(sDisliked)}
                    ${normalizeCard(sMedical)}
                  </div>
`;

const trainingGroup = `
                  <div className="mt-8 mb-4 flex items-center justify-between">
                    <button 
                      onClick={() => setIsTrainingExpanded(!isTrainingExpanded)}
                      className="flex items-center gap-2 text-xs text-[#FC5200] uppercase tracking-widest font-bold focus:outline-none"
                    >
                      <span>Training & Fueling</span>
                      {isTrainingExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {isTrainingExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-4 overflow-hidden"
                      >
                        ${normalizeCard(sRace)}
                        ${normalizeCard(sFineTune)}
                        ${normalizeCard(sSupplements)}
                      </motion.div>
                    )}
                  </AnimatePresence>
`;

const groupedContent = cookingGroup + dietaryGroup + trainingGroup;

code = code.replace(content, groupedContent + '\n                  ');
fs.writeFileSync('src/views/ProfileView.tsx', code);
console.log("Successfully rebuilt layout!");

