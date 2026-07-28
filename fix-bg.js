import fs from 'fs';
import path from 'path';

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

  content = content.replace(/#fdfbf7/g, '#17181C');
  
  if (original !== content) {
    fs.writeFileSync(filepath, content);
    console.log(`Updated ${filepath}`);
  }
});
