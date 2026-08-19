const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// The first fix script unintentionally altered handleToggleSupplement 
// because I matched \`users/\${auth.currentUser?.uid}/trainingLog\`, data.date
// and replaced it blindly somewhere earlier maybe? Oh, in the previous regex replace:
// code = code.replace(/const today = new Date().toISOString().split('T')[0];\n\s*const logRef = doc(db, \`users\/\$\{auth\.currentUser\.uid\}\/trainingLog\`, today);/,
//  "const logRef = doc(db, \`users/\${auth.currentUser?.uid}/trainingLog\`, data.date);");
// It might have caught another function. Let's fix line 105:

code = code.replace(
  /const logRef = doc\(db, `users\/\$\{auth\.currentUser\?\.uid\}\/trainingLog`, data\.date\);/,
  "const logRef = doc(db, `users/${auth.currentUser?.uid}/trainingLog`, today);"
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Fixed stray data.date in HomeView");
