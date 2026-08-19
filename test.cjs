const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');
if (code.includes('import { Droplet, Activity, Plus } from')) {
    console.log('Icons imported');
} else {
    code = "import { Droplet, Activity, Plus } from 'lucide-react';\n" + code;
    fs.writeFileSync('src/views/PlanView.tsx', code);
    console.log('Icons missing, added!');
}
