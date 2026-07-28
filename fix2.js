import fs from 'fs';
const lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// Find the line index of `fetchAndGenerate();`
const idx = lines.findIndex(line => line.includes('fetchAndGenerate();'));
if (idx !== -1) {
  // Remove the next two lines
  lines.splice(idx + 1, 2);
  fs.writeFileSync('src/App.tsx', lines.join('\n'));
}
