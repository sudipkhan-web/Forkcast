const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// I need to import ChevronUp and ChevronDown if they aren't imported.
if (!code.includes('ChevronUp') || !code.includes('ChevronDown')) {
  code = code.replace(/import \{ (.*?) \} from 'lucide-react';/, "import { $1, ChevronUp, ChevronDown } from 'lucide-react';");
}

fs.writeFileSync('src/views/ProfileView.tsx', code);
