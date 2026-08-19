const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const getSection = (name) => {
    const idx = code.indexOf(name);
    if (idx === -1) return null;
    let startIdx = code.lastIndexOf('<section', idx);
    let endIdx = code.indexOf('</section>', startIdx) + 10;
    return { start: startIdx, end: endIdx, content: code.substring(startIdx, endIdx) };
}

const sDietary = getSection('Dietary Preferences');
const sDisliked = getSection('Disliked Ingredients');
const sMedical = getSection('Medical & Health Conditions');

const sCookingSkill = getSection('Cooking Skill Level');
const sMaxCook = getSection('Max Cooking Time');
const sFavCuisines = getSection('Favorite Cuisines');

const sRace = getSection('Race & Training Profile');
const sFineTune = getSection('Fine-tune your fueling');
const sSupplements = getSection('Supplements');

// Check if they are overlapping or nested incorrectly.
const allSecs = [sDietary, sDisliked, sMedical, sCookingSkill, sMaxCook, sFavCuisines, sRace, sFineTune, sSupplements];

allSecs.sort((a,b) => a.start - b.start);

for (let s of allSecs) {
  console.log(s.start, s.end, s.content.substring(0, 50).replace(/\n/g, ' '));
}

