const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const getSection = (name) => {
    const idx = code.indexOf(name);
    if (idx === -1) return null;
    let startIdx = code.lastIndexOf('<section', idx);
    
    let endIdx = code.indexOf('</section>', startIdx) + 10;
    
    // some are divs? let's just do an iterative approach using `<section` and `</section>`
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

console.log("Dietary", sDietary != null);
console.log("Disliked", sDisliked != null);
console.log("Medical", sMedical != null);
console.log("CookingSkill", sCookingSkill != null);
console.log("MaxCook", sMaxCook != null);
console.log("FavCuisines", sFavCuisines != null);
console.log("Race", sRace != null);
console.log("FineTune", sFineTune != null);
console.log("Supplements", sSupplements != null);

