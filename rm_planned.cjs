const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

const regex = /<h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-2">Planned<\/h3>[\s\S]*?<h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4">Actually Logged<\/h3>/;

code = code.replace(regex, '<h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4">Actually Logged</h3>');

fs.writeFileSync('src/views/PlanView.tsx', code);
console.log("Removed Planned block");
