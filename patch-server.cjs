const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const signatureOld = `        inventoryItems,
        healthConditions,
        specificMealType,
        trainingDayType
      } = req.body;`;

const signatureNew = `        inventoryItems,
        healthConditions,
        specificMealType,
        trainingDayType,
        weightKg
      } = req.body;`;

content = content.replace(signatureOld, signatureNew);

const callOld = `        favoriteMealNamesStr || "",
        inventoryItems || [],
        healthConditions || [],
        specificMealType,
        trainingDayType
      );`;

const callNew = `        favoriteMealNamesStr || "",
        inventoryItems || [],
        healthConditions || [],
        specificMealType,
        trainingDayType,
        weightKg
      );`;

content = content.replace(callOld, callNew);
fs.writeFileSync('server.ts', content);
