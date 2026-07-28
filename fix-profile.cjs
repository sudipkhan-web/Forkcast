const fs = require('fs');

let content = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// 1. We need to find the blocks for Training Status, Biometrics, Skill Level, and Max Cooking Time.
const trainingStart = content.indexOf('{/* Training Status */}');
const maxCookEnd = content.indexOf('</section>', content.indexOf('{/* Max Cooking Time */}')) + '</section>'.length;

const extractedBlocks = content.substring(trainingStart, maxCookEnd);

// Remove them from the old location
content = content.substring(0, trainingStart) + content.substring(maxCookEnd);

// 2. Modify the extracted blocks to use `person` instead of `profile`
let modifiedBlocks = extractedBlocks
  .replace(/profile\.raceType/g, 'person.raceType')
  .replace(/setProfile\(prev => \(\{ \.\.\.prev, raceType: value \}\)\);\\n\s*if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ raceType: value \}, \{ merge: true \}\);/g, 'updateHouseholdMember({ ...person, raceType: value });')
  .replace(/profile\.raceDate/g, 'person.raceDate')
  .replace(/setProfile\(prev => \(\{ \.\.\.prev, raceDate: value \}\)\);\\n\s*if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ raceDate: value \}, \{ merge: true \}\);/g, 'updateHouseholdMember({ ...person, raceDate: value });')
  .replace(/profile\.weeklyTrainingDays/g, 'person.weeklyTrainingDays')
  .replace(/setProfile\(prev => \(\{ \.\.\.prev, weeklyTrainingDays: value \}\)\);\\n\s*if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ weeklyTrainingDays: value \}, \{ merge: true \}\);/g, 'updateHouseholdMember({ ...person, weeklyTrainingDays: value });')
  
  .replace(/profile\.age/g, 'person.age')
  .replace(/setProfile\(prev => \(\{ \.\.\.prev, age: value \}\)\);\\n\s*if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ age: value \}, \{ merge: true \}\);/g, 'updateHouseholdMember({ ...person, age: value });')
  
  .replace(/profile\.biologicalSex/g, 'person.biologicalSex')
  .replace(/setProfile\(prev => \(\{ \.\.\.prev, biologicalSex: sex \}\)\);\\n\s*if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ biologicalSex: sex \}, \{ merge: true \}\);/g, 'updateHouseholdMember({ ...person, biologicalSex: sex });')
  
  .replace(/profile\.heightCm/g, 'person.heightCm')
  .replace(/setProfile\(prev => \(\{ \.\.\.prev, heightCm: value \}\)\);\\n\s*if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ heightCm: value \}, \{ merge: true \}\);/g, 'updateHouseholdMember({ ...person, heightCm: value });')
  
  .replace(/profile\.weightKg/g, 'person.weightKg')
  .replace(/setProfile\(prev => \(\{ \.\.\.prev, weightKg: value \}\)\);\\n\s*if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ weightKg: value \}, \{ merge: true \}\);/g, 'updateHouseholdMember({ ...person, weightKg: value });')
  
  .replace(/profile\.skillLevel/g, 'person.skillLevel')
  .replace(/setProfile\(prev => \(\{ \.\.\.prev, skillLevel: skill \}\)\);\\n\s*if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ skillLevel: skill \}, \{ merge: true \}\);/g, 'updateHouseholdMember({ ...person, skillLevel: skill });')
  
  .replace(/profile\.maxCookingTime/g, 'person.maxCookingTime')
  .replace(/setProfile\(prev => \(\{ \.\.\.prev, maxCookingTime: time \}\)\);\\n\s*if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ maxCookingTime: time \}, \{ merge: true \}\);/g, 'updateHouseholdMember({ ...person, maxCookingTime: time });');

// 3. Insert modified blocks into the person editor, right after the Disliked Ingredients section
const insertionPoint = content.indexOf('</section>', content.indexOf('Disliked Ingredients')) + '</section>'.length;

content = content.substring(0, insertionPoint) + '\\n' + modifiedBlocks + content.substring(insertionPoint);

fs.writeFileSync('src/views/ProfileView.tsx', content);

console.log("Done ProfileView");
