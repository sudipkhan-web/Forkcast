const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // InventoryView.tsx specific semantic change
  if (file.includes('InventoryView.tsx')) {
    content = content.replace(/isExpiringSoon \? 'text-emerald-500 font-medium'/g, "isExpiringSoon ? 'text-amber-500 font-medium'");
  }

  content = content.replace(/hover:bg-emerald-50\/50/g, 'hover:bg-[#FC5200]/10');
  content = content.replace(/bg-emerald-50\/50/g, 'bg-[#FC5200]/10');
  content = content.replace(/hover:bg-emerald-50/g, 'hover:bg-[#FC5200]/10');
  content = content.replace(/bg-emerald-50/g, 'bg-[#FC5200]/10');
  content = content.replace(/hover:bg-emerald-100/g, 'hover:bg-[#FC5200]/15');
  content = content.replace(/bg-emerald-100/g, 'bg-[#FC5200]/15');
  
  content = content.replace(/focus:ring-emerald-500\/20/g, 'focus:ring-[#FC5200]/20');
  content = content.replace(/focus:ring-emerald-500\/50/g, 'focus:ring-[#FC5200]/50');
  content = content.replace(/focus:ring-emerald-\d+(\/\d+)?/g, 'focus:ring-[#FC5200]$1');
  
  content = content.replace(/focus:border-emerald-500/g, 'focus:border-[#FC5200]');
  content = content.replace(/focus:border-emerald-\d+/g, 'focus:border-[#FC5200]');
  
  content = content.replace(/hover:border-emerald-500/g, 'hover:border-[#FC5200]/40');
  content = content.replace(/hover:border-emerald-\d+/g, 'hover:border-[#FC5200]/40');
  
  content = content.replace(/border-emerald-500\/20/g, 'border-[#FC5200]/20');
  content = content.replace(/border-emerald-500/g, 'border-[#FC5200]');
  content = content.replace(/border-emerald-200/g, 'border-[#FC5200]/40');
  content = content.replace(/border-emerald-\d+/g, 'border-[#FC5200]/40');
  
  content = content.replace(/bg-emerald-500/g, 'bg-[#FC5200]');
  content = content.replace(/bg-emerald-\d+/g, 'bg-[#FC5200]');
  
  content = content.replace(/hover:text-emerald-500/g, 'hover:text-[#FC5200]');
  content = content.replace(/hover:text-emerald-\d+/g, 'hover:text-[#FC5200]');
  
  content = content.replace(/text-emerald-500/g, 'text-[#FC5200]');
  content = content.replace(/text-emerald-\d+/g, 'text-[#FC5200]');
  
  content = content.replace(/ring-emerald-\d+/g, 'ring-[#FC5200]');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
