const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace("\\n             (!('trackedSupplements'", "\n             (!('trackedSupplements'");

fs.writeFileSync('firestore.rules', code);
console.log("Fixed newline");
