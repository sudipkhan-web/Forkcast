const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "  useEffect(() => {\n    setSeenMealIds(prev => Array.from(new Set([...prev, ...likedMealIds, ...dislikedMealIds])));\n  }, [likedMealIds, dislikedMealIds]);",
  "  useEffect(() => {\n    setSeenMealIds(prev => Array.from(new Set([...prev, ...likedMealIds, ...dislikedMealIds])));\n  }, [likedMealIds, dislikedMealIds]);\n\n  useEffect(() => {\n    setSeenRefineMealIds(prev => Array.from(new Set([...prev, ...likedMealIds, ...dislikedMealIds])));\n  }, [likedMealIds, dislikedMealIds]);"
);

fs.writeFileSync('src/App.tsx', code);
