const fs = require('fs');
let content = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

content = content.replace(
  "import { Star, RefreshCw, Sparkles, Share, Target } from 'lucide-react';",
  "import { Star, RefreshCw, Sparkles, Share, Target, User } from 'lucide-react';"
);

content = content.replace(
  "<NotificationBell />",
  "<NotificationBell />\n          <button \n            onClick={() => setActiveTab('profile')}\n            className=\"p-2 text-stone-400 hover:text-[#FC5200] transition-all active:scale-[0.98] relative\"\n          >\n            <User className=\"w-5 h-5\" />\n          </button>"
);

fs.writeFileSync('src/views/HomeView.tsx', content);
