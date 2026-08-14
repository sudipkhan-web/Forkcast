const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '  if (!isAuthReady) {\n    return <div className="min-h-screen flex items-center justify-center bg-[#17181C]">Loading...</div>;\n  }',
  '  if (!isAuthReady) {\n    return (\n      <div className="min-h-screen flex items-center justify-center bg-[#FC5200] text-white">\n        <div className="flex flex-col items-center justify-center">\n          <Flame className="w-20 h-20 mb-4 animate-pulse" />\n          <h1 className="text-4xl font-display font-bold tracking-tight">Forkcast</h1>\n        </div>\n      </div>\n    );\n  }'
);

code = code.replace(
  '<ChefHat className="w-20 h-20 mb-4 animate-pulse" />',
  '<Flame className="w-20 h-20 mb-4 animate-pulse" />'
);

const oldTernary = `      {isProfileLoaded && !profile.hasCompletedOnboarding ? (`;
const newTernary = `      {!isProfileLoaded ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#FC5200] text-white">
          <Flame className="w-20 h-20 mb-4 animate-pulse" />
          <h1 className="text-4xl font-display font-bold tracking-tight">Forkcast</h1>
        </div>
      ) : !profile.hasCompletedOnboarding ? (`;

// Note: the old code was:
// {isProfileLoaded && !profile.hasCompletedOnboarding ? (
// ...
// ) : isProfileLoaded && !profile.hasAcceptedTerms ? (

code = code.replace(oldTernary, newTernary);
code = code.replace(
  ") : isProfileLoaded && !profile.hasAcceptedTerms ? (",
  ") : !profile.hasAcceptedTerms ? ("
);

fs.writeFileSync('src/App.tsx', code);
