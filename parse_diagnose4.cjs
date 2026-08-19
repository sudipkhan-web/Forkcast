const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const lastFunctionStart = code.lastIndexOf('const');
console.log(code.substring(code.length - 300));
