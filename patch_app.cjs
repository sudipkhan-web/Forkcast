const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add Import
content = content.replace(
  "import { OnboardingView } from './views/OnboardingView';",
  "import { OnboardingView } from './views/OnboardingView';\nimport { TermsGateView } from './views/TermsGateView';"
);

// 2. Add Condition
const target = "        />\n      ) : (";
const replacement = `        />
      ) : isProfileLoaded && !profile.hasAcceptedTerms ? (
        <TermsGateView onAccept={async () => {
          if (userId) {
            await setDoc(doc(db, 'users', userId), { hasAcceptedTerms: true, termsAcceptedAt: new Date().toISOString() }, { merge: true })
              .catch(e => handleFirestoreError(e, OperationType.UPDATE, \`users/\${userId}\`));
          }
        }} />
      ) : (`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx");
