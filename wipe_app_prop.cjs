const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /trainingLogs=\{trainingLogs\?\.reduce\(\(acc: any, log: any\) => \(\{\.\.\.acc, \[log\.date\]: log\}\), \{\}\) \|\| \{\}\}/,
  ""
);

fs.writeFileSync('src/App.tsx', code);
