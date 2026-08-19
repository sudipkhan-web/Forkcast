const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const target = "(!('supplementsTaken' in request.resource.data) || request.resource.data.supplementsTaken == null || (request.resource.data.supplementsTaken is list && request.resource.data.supplementsTaken.size() <= 50));";
const replacement = "(!('supplementsTaken' in request.resource.data) || request.resource.data.supplementsTaken == null || (request.resource.data.supplementsTaken is list && request.resource.data.supplementsTaken.size() <= 50)) &&\n            (!('trainingFeeling' in request.resource.data) || request.resource.data.trainingFeeling == null || request.resource.data.trainingFeeling in ['strong', 'ok', 'rough', 'dnf']);";

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('firestore.rules', code);
  console.log("Updated firestore.rules");
} else {
  console.log("Target string not found in firestore.rules!");
}
