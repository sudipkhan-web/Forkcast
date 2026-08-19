const fs = require('fs');
let lines = fs.readFileSync('src/views/HomeView.tsx', 'utf8').split('\n');

// Find the line index of `      {scannedMealPreview && (` (the duplicate)
let idx1 = -1;
let count = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{scannedMealPreview && (')) {
    count++;
    if (count === 2) {
      idx1 = i;
      break;
    }
  }
}

if (idx1 > -1) {
  lines.splice(idx1, 8); // Remove 8 lines covering the second modal rendering
}

fs.writeFileSync('src/views/HomeView.tsx', lines.join('\n'));
