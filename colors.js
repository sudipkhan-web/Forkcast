import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function walkSync(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkSync(fullPath, callback);
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        callback(fullPath);
      }
    }
  });
}

walkSync('src', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  content = content.replace(/bg-\[#fdfbf7\]/g, 'bg-[#17181C]');
  content = content.replace(/text-stone-800/g, 'text-white');
  content = content.replace(/text-stone-900/g, 'text-white');
  content = content.replace(/emerald-600/g, '[#FC5200]');
  content = content.replace(/emerald-700/g, '[#FC5200]');
  
  if (original !== content) {
    fs.writeFileSync(filepath, content);
    console.log(`Updated ${filepath}`);
  }
});
