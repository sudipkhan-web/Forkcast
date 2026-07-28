const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const learningNav = `          <button 
            onClick={() => setActiveTab('learning')}
            className={\`flex flex-col items-center justify-center p-2 min-w-[56px] transition-all active:scale-[0.98] \${activeTab === 'learning' ? 'text-[#FC5200]' : 'text-stone-400 hover:text-stone-900'}\`}
          >
            <Compass className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Discover</span>
          </button>`;

if (content.includes(learningNav)) {
  content = content.replace(learningNav, "");
  fs.writeFileSync('src/App.tsx', content);
}
