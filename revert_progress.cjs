const fs = require('fs');
let code = fs.readFileSync('src/views/ProgressView.tsx', 'utf8');

// The previous regex didn't match the History section correctly because of the literal characters in the regex.
// Let's find the exact string "        {/* History Section */}" and slice it out up to "      </motion.div>".

const historyStart = code.indexOf('        {/* History Section */}');
if (historyStart !== -1) {
  const motionEnd = code.indexOf('      </motion.div>', historyStart);
  if (motionEnd !== -1) {
    code = code.substring(0, historyStart) + '      </motion.div>\n';
  }
}

// Ensure the handleConfirmManualMeal is removed.
const handlerStart = code.indexOf('  const handleConfirmManualMeal = async');
if (handlerStart !== -1) {
  const handlerEnd = code.indexOf('  let daysRemaining:');
  if (handlerEnd !== -1) {
    code = code.substring(0, handlerStart) + code.substring(handlerEnd);
  }
}

// Remove the manualMealDate state.
code = code.replace(/\n\s*const \[manualMealDate, setManualMealDate\] = React\.useState<string \| null>\(null\);/, "");

// Clean imports in ProgressView
code = code.replace(/import \{ MealPhotoConfirmModal \} from '\.\.\/components\/MealPhotoConfirmModal';\n/, "");
code = code.replace(/import \{ doc, setDoc, arrayUnion \} from 'firebase\/firestore';\n/, "");
code = code.replace(/import \{ auth, db \} from '\.\.\/firebase';\n/, "");
code = code.replace(/import toast from 'react-hot-toast';\n/, "");
code = code.replace(/import \{ Flame, Target, User, Droplet, Activity, Plus \} from 'lucide-react';/, "import { Flame, Target, User } from 'lucide-react';");

fs.writeFileSync('src/views/ProgressView.tsx', code);
console.log("Successfully reverted ProgressView.tsx");
