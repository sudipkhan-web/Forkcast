const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');
console.log(code.substring(code.indexOf("const handleMealPhotoUpload"), code.indexOf("const handleConfirmMealPhoto")));
