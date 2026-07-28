const fs = require('fs');
let content = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const refineStart = content.indexOf('{/* Refine Taste Button */}');
const refineEnd = content.indexOf('</section>', refineStart) + '</section>'.length;

const refineBlock = content.substring(refineStart, refineEnd);
content = content.substring(0, refineStart) + content.substring(refineEnd);

// Find where to insert it: before Push Notifications Settings
const pushStart = content.indexOf('{/* Push Notifications Settings */}');
content = content.substring(0, pushStart) + refineBlock + '\n\n' + content.substring(pushStart);

fs.writeFileSync('src/views/ProfileView.tsx', content.trim() + '\n');
console.log("Moved Refine Taste Button");
