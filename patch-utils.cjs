const fs = require('fs');
let content = fs.readFileSync('src/utils/progressUtils.ts', 'utf8');

content = content.replace(
  "import { CARB_TARGET_BANDS } from '../constants';",
  "import { CARB_TARGET_BANDS, CARB_TARGET_GRAMS_PER_KG } from '../constants';"
);

content = content.replace(
  "export function getProgressStats(trainingLogs: { date: string, dayType?: string, acceptedMeals?: any[] }[]) {",
  "export function getProgressStats(trainingLogs: { date: string, dayType?: string, acceptedMeals?: any[] }[], weightKg?: number) {"
);

const oldTargetCalc = "const [targetMin, targetMax] = (dayType && CARB_TARGET_BANDS[dayType]) ? CARB_TARGET_BANDS[dayType] : [200, 280];";
const newTargetCalc = `
    let targetMin = 200;
    let targetMax = 280;
    if (dayType) {
      if (weightKg && CARB_TARGET_GRAMS_PER_KG[dayType]) {
        targetMin = CARB_TARGET_GRAMS_PER_KG[dayType][0] * weightKg;
        targetMax = CARB_TARGET_GRAMS_PER_KG[dayType][1] * weightKg;
      } else if (CARB_TARGET_BANDS[dayType]) {
        targetMin = CARB_TARGET_BANDS[dayType][0];
        targetMax = CARB_TARGET_BANDS[dayType][1];
      }
    }
`;
content = content.replace(oldTargetCalc, newTargetCalc);

fs.writeFileSync('src/utils/progressUtils.ts', content);
