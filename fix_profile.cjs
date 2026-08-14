const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

code = code.replace(
  "import { LogOut, ChevronLeft",
  "import { LogOut, ChevronLeft, Settings"
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
