const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '  if (!isAuthReady) {\n    return (\n      <div className="min-h-screen flex items-center justify-center bg-[#FC5200] text-white">\n        <div className="flex flex-col items-center justify-center">\n          <Flame className="w-20 h-20 mb-4 animate-pulse" />\n          <h1 className="text-4xl font-display font-bold tracking-tight">Forkcast</h1>\n        </div>\n      </div>\n    );\n  }',
  '  if (!isAuthReady) {\n    return (\n      <div className="max-w-md mx-auto h-[100dvh] flex flex-col bg-[#FC5200] text-white overflow-hidden relative font-sans">\n        <div className="flex-1 flex flex-col items-center justify-center">\n          <Flame className="w-20 h-20 mb-4 animate-pulse" />\n          <h1 className="text-4xl font-display font-bold tracking-tight">Forkcast</h1>\n        </div>\n      </div>\n    );\n  }'
);

fs.writeFileSync('src/App.tsx', code);
