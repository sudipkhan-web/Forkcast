const fs = require('fs');
let content = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const trainingStart = content.indexOf('{/* Training Profile */}');
const maxCookEnd = content.indexOf('</section>', content.indexOf('{/* Max Cooking Time */}')) + '</section>'.length;

let block = content.substring(trainingStart, maxCookEnd);

block = block.replace(/profile\.raceType/g, 'person.raceType');
block = block.replace(/profile\.raceDate/g, 'person.raceDate');
block = block.replace(/profile\.weeklyTrainingDays/g, 'person.weeklyTrainingDays');
block = block.replace(/profile\.age/g, 'person.age');
block = block.replace(/profile\.biologicalSex/g, 'person.biologicalSex');
block = block.replace(/profile\.heightCm/g, 'person.heightCm');
block = block.replace(/profile\.weightKg/g, 'person.weightKg');
block = block.replace(/profile\.skillLevel/g, 'person.skillLevel');
block = block.replace(/profile\.maxCookingTime/g, 'person.maxCookingTime');

content = content.substring(0, trainingStart) + block + content.substring(maxCookEnd);
fs.writeFileSync('src/views/ProfileView.tsx', content);
