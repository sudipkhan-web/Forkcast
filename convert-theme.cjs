const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');

// Exclude ProgressView.tsx, TasteLearningScreen, AuthView (it has its own dark theme already perhaps, let's see)
const targetFiles = files.filter(f => !f.includes('ProgressView.tsx') && !f.includes('TasteLearningScreen.tsx'));

const mappings = [
  { from: /bg-\[#FAFAFA\]/g, to: 'bg-[#17181C]' },
  { from: /bg-white/g, to: 'bg-stone-900' },
  { from: /bg-stone-50/g, to: 'bg-stone-900' },
  { from: /bg-stone-100/g, to: 'bg-stone-800' },
  { from: /hover:bg-stone-50/g, to: 'hover:bg-stone-800' },
  { from: /hover:bg-stone-100/g, to: 'hover:bg-stone-800' },
  { from: /hover:bg-stone-200/g, to: 'hover:bg-stone-700' },
  { from: /border-stone-200\/60/g, to: 'border-stone-800' },
  { from: /border-stone-200/g, to: 'border-stone-800' },
  { from: /text-stone-900/g, to: 'text-white' },
  { from: /text-stone-800/g, to: 'text-stone-200' },
  { from: /text-stone-700/g, to: 'text-stone-300' },
  { from: /text-stone-600/g, to: 'text-stone-400' },
  { from: /hover:text-stone-900/g, to: 'hover:text-white' },
  { from: /hover:text-stone-800/g, to: 'hover:text-stone-200' },
  { from: /hover:text-stone-700/g, to: 'hover:text-stone-300' },
  { from: /shadow-\[0_8px_30px_rgb\(28,25,23,0\.06\)\]/g, to: 'shadow-xl' },
  { from: /bg-gradient-to-t from-stone-900\/40 to-transparent/g, to: 'bg-gradient-to-t from-[#17181C]\/90 via-[#17181C]\/40 to-transparent' },
];

targetFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  mappings.forEach(m => {
    content = content.replace(m.from, m.to);
  });
  
  if (file.includes('App.tsx')) {
    content = content.replace(/<nav className="bg-stone-900 border-t border-stone-800 shrink-0 z-10 pb-safe">/g, '<nav className="bg-[#17181C] border-t border-stone-800 shrink-0 z-10 pb-safe">');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
