const fs = require('fs');
let code = fs.readFileSync('src/firebaseUtils.tsx', 'utf8');
code = code.replace(
  "export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {",
  "export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, showToast?: (msg: string, type: 'error'|'success') => void) {\n  if (showToast) {\n    showToast(\"Something went wrong saving your changes \\u2014 please try again.\", 'error');\n  }"
);
fs.writeFileSync('src/firebaseUtils.tsx', code);
