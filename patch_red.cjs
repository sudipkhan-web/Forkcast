const fs = require('fs');

const files = [
  'src/views/FavoritesView.tsx',
  'src/views/PlanView.tsx',
  'src/views/ProfileView.tsx',
  'src/views/HomeView.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    if (code.includes('hover:bg-red-50')) {
      code = code.replace(/hover:bg-red-50/g, 'hover:bg-red-500/10');
      fs.writeFileSync(file, code);
      console.log(`Updated ${file}`);
    }
  }
}
