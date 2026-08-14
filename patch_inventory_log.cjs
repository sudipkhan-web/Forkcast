const fs = require('fs');

let code = fs.readFileSync('src/views/InventoryView.tsx', 'utf8');

const oldLi = `<li key={log.id} className={\`\${CARD} p-5 flex items-start gap-4\`}>
                  <div className={\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 \${
                    log.action === 'add' ? 'bg-emerald-100 text-[#FC5200]' :
                    log.action === 'consume' ? 'bg-orange-100 text-orange-600' :
                    log.action === 'subtract' ? 'bg-stone-800 text-stone-400' :
                    'bg-red-100 text-red-600'
                  }\`}>
                    {log.action === 'add' ? <Plus className="w-5 h-5" /> :
                     log.action === 'consume' ? <Minus className="w-5 h-5" /> :
                     log.action === 'subtract' ? <Minus className="w-5 h-5" /> :
                     <Archive className="w-5 h-5" />}
                  </div>`;

const newLi = `<li key={log.id} className={\`\${CARD} p-3.5 flex items-start gap-2.5\`}>
                  <div className={\`w-7 h-7 rounded-full flex items-center justify-center shrink-0 \${
                    log.action === 'add' ? 'bg-[#FC5200]/15 text-[#FC7A33]' :
                    (log.action === 'consume' || log.action === 'subtract') ? 'bg-white/[0.06] text-stone-300' :
                    'bg-red-500/15 text-red-400'
                  }\`}>
                    {log.action === 'add' ? <Plus className="w-3.5 h-3.5" /> :
                     log.action === 'consume' ? <Minus className="w-3.5 h-3.5" /> :
                     log.action === 'subtract' ? <Minus className="w-3.5 h-3.5" /> :
                     <Archive className="w-3.5 h-3.5" />}
                  </div>`;

if (code.includes(oldLi)) {
  code = code.replace(oldLi, newLi);
  fs.writeFileSync('src/views/InventoryView.tsx', code);
  console.log('Successfully patched InventoryView.tsx');
} else {
  console.log('Could not find the target code in InventoryView.tsx');
}
