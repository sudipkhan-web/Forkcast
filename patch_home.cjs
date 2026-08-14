const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// Insert import
code = code.replace(
  "import { useAppContext } from '../context/AppContext';",
  "import { useAppContext } from '../context/AppContext';\nimport { useToast } from '../components/Toast';"
);

// Insert hook inside component
code = code.replace(
  "export function HomeView({",
  "export function HomeView({\n"
);
// wait, let's find the start of the component body
code = code.replace(
  "}: HomeViewProps) {\n",
  "}: HomeViewProps) {\n  const { showToast } = useToast();\n"
);
// Fallback if formatting is slightly different:
code = code.replace(
  "  const { profile, setProfile } = useAppContext();",
  "  const { showToast } = useToast();\n  const { profile, setProfile } = useAppContext();"
);

// Update catch block
code = code.replace(
  "console.error(\"Error generating meals manually:\", err);",
  "console.error(\"Error generating meals manually:\", err);\n              showToast(\"Couldn't generate recipes \\u2014 check your connection and try again.\", 'error');"
);

fs.writeFileSync('src/views/HomeView.tsx', code);
