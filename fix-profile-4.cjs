const fs = require('fs');
let content = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const trainingStart = content.indexOf('{/* Training Profile */}');
const maxCookEnd = content.indexOf('</section>', content.indexOf('{/* Max Cooking Time */}')) + '</section>'.length;

console.log("trainingStart:", trainingStart, "maxCookEnd:", maxCookEnd);
if (trainingStart === -1 || maxCookEnd === -1) {
    console.log("NOT FOUND!");
    process.exit(1);
}

const sectionsToMove = content.substring(trainingStart, maxCookEnd);

// Remove them from their current location
content = content.substring(0, trainingStart) + content.substring(maxCookEnd);

// Insert them into the editingPersonId block, right after "Disliked Ingredients"
const insertionPoint = content.indexOf('</section>', content.indexOf('Disliked Ingredients')) + '</section>'.length;
content = content.substring(0, insertionPoint) + '\n\n' + sectionsToMove + '\n\n' + content.substring(insertionPoint);

fs.writeFileSync('src/views/ProfileView.tsx', content);
console.log("Moved successfully!");
