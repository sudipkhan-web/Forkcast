const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

code = code.replace(
  "import { Droplet, Activity, Plus } from 'lucide-react';",
  "import { Droplet, Activity, Plus, Camera, Loader2 } from 'lucide-react';\nimport { captureMealPhoto } from '../services/mealPhotoAnalyzer';\nimport { useToast } from '../components/Toast';"
);

fs.writeFileSync('src/views/PlanView.tsx', code);
