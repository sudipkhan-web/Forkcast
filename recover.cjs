const fs = require('fs');
const map = JSON.parse(fs.readFileSync('dist/server.cjs.map', 'utf8'));
const index = map.sources.indexOf('src/views/ProfileView.tsx');
if (index !== -1) {
  fs.writeFileSync('src/views/ProfileView.tsx', map.sourcesContent[index]);
  console.log('Recovered!');
} else {
  console.log('Not found in sourcemap. Sources: ', map.sources.join(', '));
}
