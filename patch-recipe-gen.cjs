const fs = require('fs');
let content = fs.readFileSync('src/services/recipeGenerator.ts', 'utf8');

const signatureOld = `  inventoryItems: string[] = [],
  healthConditions: string[] = [],
  specificMealType?: string,
  trainingDayType?: string
): Promise<Meal[]> => {`;

const signatureNew = `  inventoryItems: string[] = [],
  healthConditions: string[] = [],
  specificMealType?: string,
  trainingDayType?: string,
  weightKg?: number
): Promise<Meal[]> => {`;

content = content.replace(signatureOld, signatureNew);

const fetchOld = `        inventoryItems,
        healthConditions,
        specificMealType,
        trainingDayType
      })
    });`;

const fetchNew = `        inventoryItems,
        healthConditions,
        specificMealType,
        trainingDayType,
        weightKg
      })
    });`;

content = content.replace(fetchOld, fetchNew);

fs.writeFileSync('src/services/recipeGenerator.ts', content);
