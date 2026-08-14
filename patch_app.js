const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "export default function App() {\n  return (\n    <AppProvider>\n      <MainApp />\n    </AppProvider>\n  );\n}",
  "export default function App() {\n  return (\n    <ToastProvider>\n      <AppProvider>\n        <MainApp />\n      </AppProvider>\n    </ToastProvider>\n  );\n}"
);
fs.writeFileSync('src/App.tsx', code);
