const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

const validationRegex = /(!\('notifications' in request.resource.data\) \|\| request.resource.data.notifications is map);/;
const newValidations = `(!('notifications' in request.resource.data) || request.resource.data.notifications is map) &&
             (!('raceType' in request.resource.data) || request.resource.data.raceType is string) &&
             (!('raceDate' in request.resource.data) || request.resource.data.raceDate is string) &&
             (!('weeklyTrainingDays' in request.resource.data) || (request.resource.data.weeklyTrainingDays is number && request.resource.data.weeklyTrainingDays >= 0 && request.resource.data.weeklyTrainingDays <= 7)) &&
             (!('currentTrainingDayType' in request.resource.data) || request.resource.data.currentTrainingDayType in ['Rest', 'Easy', 'Long', 'Speed/Interval', 'Brick', 'Race Day']) &&
             (!('age' in request.resource.data) || (request.resource.data.age is number && request.resource.data.age >= 10 && request.resource.data.age <= 100)) &&
             (!('heightCm' in request.resource.data) || (request.resource.data.heightCm is number && request.resource.data.heightCm >= 100 && request.resource.data.heightCm <= 250)) &&
             (!('weightKg' in request.resource.data) || (request.resource.data.weightKg is number && request.resource.data.weightKg >= 30 && request.resource.data.weightKg <= 200)) &&
             (!('biologicalSex' in request.resource.data) || request.resource.data.biologicalSex in ['male', 'female']);`;

content = content.replace(validationRegex, newValidations);

const commentRegex = /\/\/   - dislikedTags: map \(optional\) - Map of disliked tags and their frequencies/;
const newComments = `//   - dislikedTags: map (optional) - Map of disliked tags and their frequencies
    //   - raceType: string (optional)
    //   - raceDate: string (optional)
    //   - weeklyTrainingDays: number (optional) - 0-7
    //   - currentTrainingDayType: string (optional)
    //   - age: number (optional) - 10-100
    //   - heightCm: number (optional) - 100-250
    //   - weightKg: number (optional) - 30-200
    //   - biologicalSex: string (optional) - 'male' or 'female'`;

content = content.replace(commentRegex, newComments);
fs.writeFileSync('firestore.rules', content);
