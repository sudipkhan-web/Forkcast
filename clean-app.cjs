const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const learningStart = content.indexOf('      {/* Taste Learning Tab */}');
const detailsStart = content.indexOf('      {/* Details View */}');

if (learningStart !== -1 && detailsStart !== -1) {
  content = content.substring(0, learningStart) + content.substring(detailsStart);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Removed duplicate learning tab");
}
