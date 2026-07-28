const fs = require('fs');
let content = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// Find the block we moved (Training Profile to Max Cooking Time)
const trainingStart = content.indexOf('{/* Training Profile */}');
const maxCookEnd = content.indexOf('</section>', content.indexOf('{/* Max Cooking Time */}')) + '</section>'.length;

let block = content.substring(trainingStart, maxCookEnd);

// Replacements
block = block.replace(/setProfile\(prev => \(\{ \.\.\.prev, raceType: value \}\)\);/g, 'updateHouseholdMember({ ...person, raceType: value });');
block = block.replace(/if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ raceType: value \}, \{ merge: true \}\);/g, '');

block = block.replace(/setProfile\(prev => \(\{ \.\.\.prev, raceDate: value \}\)\);/g, 'updateHouseholdMember({ ...person, raceDate: value });');
block = block.replace(/if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ raceDate: value \}, \{ merge: true \}\);/g, '');

block = block.replace(/setProfile\(prev => \(\{ \.\.\.prev, weeklyTrainingDays: value \}\)\);/g, 'updateHouseholdMember({ ...person, weeklyTrainingDays: value });');
block = block.replace(/if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ weeklyTrainingDays: value \}, \{ merge: true \}\);/g, '');

block = block.replace(/setProfile\(prev => \(\{ \.\.\.prev, age: value \}\)\);/g, 'updateHouseholdMember({ ...person, age: value });');
block = block.replace(/if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ age: value \}, \{ merge: true \}\);/g, '');

block = block.replace(/setProfile\(prev => \(\{ \.\.\.prev, biologicalSex: sex \}\)\);/g, 'updateHouseholdMember({ ...person, biologicalSex: sex });');
block = block.replace(/if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ biologicalSex: sex \}, \{ merge: true \}\);/g, '');

block = block.replace(/setProfile\(prev => \(\{ \.\.\.prev, heightCm: value \}\)\);/g, 'updateHouseholdMember({ ...person, heightCm: value });');
block = block.replace(/if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ heightCm: value \}, \{ merge: true \}\);/g, '');

block = block.replace(/setProfile\(prev => \(\{ \.\.\.prev, weightKg: value \}\)\);/g, 'updateHouseholdMember({ ...person, weightKg: value });');
block = block.replace(/if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ weightKg: value \}, \{ merge: true \}\);/g, '');

block = block.replace(/setProfile\(prev => \(\{ \.\.\.prev, skillLevel: skill \}\)\);/g, 'updateHouseholdMember({ ...person, skillLevel: skill });');
block = block.replace(/if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ skillLevel: skill \}, \{ merge: true \}\);/g, '');

block = block.replace(/setProfile\(prev => \(\{ \.\.\.prev, maxCookingTime: time \}\)\);/g, 'updateHouseholdMember({ ...person, maxCookingTime: time });');
block = block.replace(/if \(auth\.currentUser\) setDoc\(doc\(db, 'users', auth\.currentUser\.uid\), \{ maxCookingTime: time \}, \{ merge: true \}\);/g, '');

content = content.substring(0, trainingStart) + block + content.substring(maxCookEnd);
fs.writeFileSync('src/views/ProfileView.tsx', content);
