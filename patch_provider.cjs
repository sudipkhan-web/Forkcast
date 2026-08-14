const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "    <AppContext.Provider value={{\n      userId,\n      isAuthReady,\n      profile,",
  "    <AppContext.Provider value={{\n      userId,\n      isAuthReady,\n      queuedSuggestions,\n      setQueuedSuggestions,\n      profile,"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
