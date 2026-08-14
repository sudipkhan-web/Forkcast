const fs = require('fs');

let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "setQueuedSuggestions(prev => JSON.stringify(prev) === JSON.stringify(data.queuedSuggestions || null) ? prev : (data.queuedSuggestions || null));",
  "setQueuedSuggestions(prev => JSON.stringify(prev) === JSON.stringify(data.queuedSuggestions || []) ? prev : (data.queuedSuggestions || []));"
);

// If the user doc does not exist, it executes:
// setDoc(doc(db, 'users', userId), { ...
// We should also set it to [] there, but since the snapshot will re-trigger with the new document, it will then hit the docSnap.exists() block.

fs.writeFileSync('src/context/AppContext.tsx', code);
