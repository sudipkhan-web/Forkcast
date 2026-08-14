const fs = require('fs');
let code = fs.readFileSync('src/views/ProgressView.tsx', 'utf8');

const regex = /className=\{`px-4 py-1\.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 \$\{\s*activeMacro === macro\s*\?\s*'bg-\[#FC5200\] border-\[#FC5200\] text-white shadow-sm'\s*:\s*'bg-stone-900 border-stone-800 text-stone-400 hover:border-\[#FC5200\] hover:text-\[#FC5200\]'\s*\}`\}/;

const newToggle = "className={activeMacro === macro ? 'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 bg-[#FC5200] border-[#FC5200] text-white shadow-sm' : `${PILL} shrink-0 capitalize`}";

code = code.replace(regex, newToggle);
code = code.replace(/\\\$\{/g, '${');
fs.writeFileSync('src/views/ProgressView.tsx', code);
