const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

code = code.replace(
  "import { initNotifications } from '../services/notificationService';",
  "import { initNotifications } from '../services/notificationService';\nimport { suggestFreeTextOptions } from '../services/mealPhotoAnalyzer';"
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
