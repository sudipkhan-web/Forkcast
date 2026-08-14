const fs = require('fs');
let code = fs.readFileSync('src/components/NotificationBell.tsx', 'utf8');

if (!code.includes("import { ICON_BUTTON }")) {
  code = code.replace(
    "import { useAppContext } from '../context/AppContext';",
    "import { useAppContext } from '../context/AppContext';\nimport { ICON_BUTTON } from '../styles/designTokens';"
  );
}

code = code.replace(
  'className="p-2 text-stone-400 hover:text-[#FC5200] transition-all active:scale-[0.98] relative rounded-full hover:bg-stone-800"',
  'className={`${ICON_BUTTON} relative`}'
);

fs.writeFileSync('src/components/NotificationBell.tsx', code);
