const fs = require('fs');
const content = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// The file currently consists of:
// Part A: Refine Taste Button (from start of file up to \nimport React)
const splitIndex = content.indexOf('\\nimport React');
const partA = content.substring(0, splitIndex).trim();

// Part B + Part C starts here
const rest = content.substring(splitIndex + 2); // remove \\n

// Part B: The top half of the file, up to the end of Max Cooking Time.
// We can find where Part B ends by looking for the start of Part C.
// Part C is the Push Notifications Settings.
const partCIndex = rest.indexOf('{/* Push Notifications Settings */}');
const partB = rest.substring(0, partCIndex).trim();
const partC = rest.substring(partCIndex).trim();

// Original order was:
// Part B
// Part A
// Part C

const newContent = partB + '\n\n' + partA + '\n\n' + partC + '\n';
fs.writeFileSync('src/views/ProfileView.tsx', newContent);
console.log("Restored!");
