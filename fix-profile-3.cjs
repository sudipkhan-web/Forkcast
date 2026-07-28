const fs = require('fs');
let content = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const trainingStart = content.indexOf('{/* Training Status */}');
const maxCookEnd = content.indexOf('</section>', content.indexOf('{/* Max Cooking Time */}')) + '</section>'.length;

const sectionsToMove = content.substring(trainingStart, maxCookEnd);

// Remove them from their current location
content = content.substring(0, trainingStart) + content.substring(maxCookEnd);

// Insert them into the editingPersonId block, right after "Disliked Ingredients"
const insertionPoint = content.indexOf('</section>', content.indexOf('Disliked Ingredients')) + '</section>'.length;
content = content.substring(0, insertionPoint) + '\n\n' + sectionsToMove + '\n\n' + content.substring(insertionPoint);

fs.writeFileSync('src/views/ProfileView.tsx', content);
console.log("Moved successfully!");
