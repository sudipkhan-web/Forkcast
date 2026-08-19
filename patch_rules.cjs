const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(
  /allow update: if isAuthenticated\(\) && request\.resource\.data\.diff\(resource\.data\)\.affectedKeys\(\)\.hasOnly\(\['image'\]\);/,
  "allow update: if isAuthenticated() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['image', 'mealType']); // TEMP: remove 'mealType' here after the one-time data cleanup is confirmed complete."
);

fs.writeFileSync('firestore.rules', code);
console.log("Updated firestore.rules");
