const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// The issue is exactly on line 175: there is an extra `};`
code = code.replace("    }\n  };\n  };\n\n\n  const handleConfirmMealPhoto = async (data", "    }\n  };\n\n  const handleConfirmMealPhoto = async (data");
// Also just in case:
code = code.replace("    }\n  };\n  };\n", "    }\n  };\n\n");

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Replaced!");
