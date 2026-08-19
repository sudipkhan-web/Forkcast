const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const oldProfileRule = "(!('weightKg' in request.resource.data) || (request.resource.data.weightKg is number && request.resource.data.weightKg >= 30 && request.resource.data.weightKg <= 200)) &&";
const newProfileRule = oldProfileRule + "\\n             (!('trackedSupplements' in request.resource.data) || (request.resource.data.trackedSupplements is list && request.resource.data.trackedSupplements.size() <= 50)) &&";
code = code.replace(oldProfileRule, newProfileRule);

const oldTrainingRule = `(!('waterMl' in request.resource.data) || request.resource.data.waterMl == null || (request.resource.data.waterMl is number && request.resource.data.waterMl >= 0 && request.resource.data.waterMl <= 10000));`;
const newTrainingRule = `(!('waterMl' in request.resource.data) || request.resource.data.waterMl == null || (request.resource.data.waterMl is number && request.resource.data.waterMl >= 0 && request.resource.data.waterMl <= 10000)) &&
            (!('supplementsTaken' in request.resource.data) || request.resource.data.supplementsTaken == null || (request.resource.data.supplementsTaken is list && request.resource.data.supplementsTaken.size() <= 50));`;
code = code.replace(oldTrainingRule, newTrainingRule);

fs.writeFileSync('firestore.rules', code);
console.log("Updated firestore.rules");
