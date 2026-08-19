const fs = require('fs');
let code = fs.readFileSync('src/data/recipes.ts', 'utf8');

// I need to add mealType to every meal missing it in `ALL_MEALS` array.
// The array looks like:
// export const ALL_MEALS: Meal[] = [ { id: '1', name: 'Avocado Toast', ... }, ... ]

// Simple heuristic based on name/tags:
// Breakfast: toast, pancake, oat, egg (if morning), smoothie, breakfast
// Snack: snack, protein ball, trail mix, bar, yogurt
// Lunch: sandwich, wrap, salad, bowl
// Dinner: curry, steak, pasta, burger, roast, scampi, pad thai

code = code.replace(/(\{[\s\S]*?id:\s*'[0-9]+',[\s\S]*?name:\s*'([^']+)'[\s\S]*?\})/g, (match, p1, name) => {
    if (match.includes("mealType:")) return match;
    let type = 'Dinner';
    const ln = name.toLowerCase();
    
    if (ln.includes('toast') || ln.includes('pancake') || ln.includes('oat') || ln.includes('breakfast') || ln.includes('smoothie')) type = 'Breakfast';
    else if (ln.includes('sandwich') || ln.includes('salad') || ln.includes('bowl') || ln.includes('wrap') || ln.includes('lunch')) type = 'Lunch';
    else if (ln.includes('snack') || ln.includes('bite') || ln.includes('trail mix') || ln.includes('yogurt') || ln.includes('bar') || ln.includes('cracker')) type = 'Snack';
    
    // Replace `details: '...'` with `mealType: '${type}', details: '...'`
    return match.replace(/(details:\s*')/, `mealType: '${type}', $1`);
});

fs.writeFileSync('src/data/recipes.ts', code);
console.log("Updated recipes.ts");
