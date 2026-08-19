const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const regex = /const handleConfirmMealPhoto[\s\S]*?const handleUpdateFeeling/m;
console.log(code.match(regex)[0]);
