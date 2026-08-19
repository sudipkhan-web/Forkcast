const fs = require('fs');
let code = fs.readFileSync('src/utils/progressUtils.ts', 'utf8');

const correlationCode = `
export function getFuelingPerformanceCorrelation(trainingLogs: any[], weightKg?: number) {
  let hitCarbStrong = 0;
  let hitCarbTotal = 0;
  let missCarbStrong = 0;
  let missCarbTotal = 0;

  for (const log of trainingLogs) {
    if (!log.trainingFeeling) continue;
    if (log.dayType === 'Rest') continue;

    let totalCarbs = 0;
    if (log.acceptedMeals) {
      totalCarbs = log.acceptedMeals.reduce((sum: number, meal: any) => sum + (meal.carbsGrams || 0), 0);
    }
    const [carbMin] = getCarbTarget(log.dayType, weightKg);
    const hitTarget = totalCarbs >= carbMin;

    if (hitTarget) {
      hitCarbTotal++;
      if (log.trainingFeeling === 'strong') hitCarbStrong++;
    } else {
      missCarbTotal++;
      if (log.trainingFeeling === 'strong') missCarbStrong++;
    }
  }

  return {
    hitCarbStrong,
    hitCarbTotal,
    missCarbStrong,
    missCarbTotal
  };
}
`;

code += correlationCode;

fs.writeFileSync('src/utils/progressUtils.ts', code);
console.log("Updated progressUtils.ts");
