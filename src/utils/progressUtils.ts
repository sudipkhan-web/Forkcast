import { CARB_TARGET_BANDS, CARB_TARGET_GRAMS_PER_KG, PROTEIN_TARGET_BAND_FLAT, FAT_TARGET_BAND_FLAT, PROTEIN_TARGET_GRAMS_PER_KG, FAT_TARGET_GRAMS_PER_KG } from '../constants';

export function getCarbTarget(dayType?: string, weightKg?: number): [number, number] {
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
  return [Math.round(targetMin), Math.round(targetMax)];
}


export function getProgressStats(trainingLogs: { date: string, dayType?: string, acceptedMeals?: any[] }[], weightKg?: number) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Calculate weeklyCoverage (count of last 7 days with both a dayType and at least one acceptedMeals entry)
  let weeklyCoverage = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = trainingLogs.find(l => l.date === dateStr);
    if (log && log.dayType && log.acceptedMeals && log.acceptedMeals.length > 0) {
      weeklyCoverage++;
    }
  }

  // Calculate currentStreak (consecutive days ending today with at least one acceptedMeals entry)
  let currentStreak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = trainingLogs.find(l => l.date === dateStr);
    if (log && log.acceptedMeals && log.acceptedMeals.length > 0) {
      currentStreak++;
    } else {
      break;
    }
  }


  const carbTrend = [];
  const proteinTrend = [];
  const fatTrend = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = trainingLogs.find(l => l.date === dateStr);
    
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    if (log && log.acceptedMeals) {
      totalCarbs = log.acceptedMeals.reduce((sum, meal) => sum + (meal.carbsGrams || 0), 0);
      totalProtein = log.acceptedMeals.reduce((sum, meal) => sum + (meal.proteinGrams || 0), 0);
      totalFat = log.acceptedMeals.reduce((sum, meal) => sum + (meal.fatGrams || 0), 0);
    }
    const dayType = log?.dayType;
    
    const [carbMin, carbMax] = getCarbTarget(dayType, weightKg);
    let proteinMin = PROTEIN_TARGET_BAND_FLAT[0];
    let proteinMax = PROTEIN_TARGET_BAND_FLAT[1];
    let fatMin = FAT_TARGET_BAND_FLAT[0];
    let fatMax = FAT_TARGET_BAND_FLAT[1];
    if (weightKg) {
      proteinMin = Math.round(PROTEIN_TARGET_GRAMS_PER_KG[0] * weightKg);
      proteinMax = Math.round(PROTEIN_TARGET_GRAMS_PER_KG[1] * weightKg);
      fatMin = Math.round(FAT_TARGET_GRAMS_PER_KG[0] * weightKg);
      fatMax = Math.round(FAT_TARGET_GRAMS_PER_KG[1] * weightKg);
    }

    carbTrend.push({ date: dateStr, total: totalCarbs, targetMin: carbMin, targetMax: carbMax });
    proteinTrend.push({ date: dateStr, total: totalProtein, targetMin: proteinMin, targetMax: proteinMax });
    fatTrend.push({ date: dateStr, total: totalFat, targetMin: fatMin, targetMax: fatMax });
  }

  return {
    weeklyCoverage,
    currentStreak,
    carbTrend,
    proteinTrend,
    fatTrend
  };
}

export function getTodayMacros(acceptedMeals: any[], person: { weightKg?: number }, dayType?: string) {
  const currentCarbs = Math.round(acceptedMeals.reduce((sum, meal) => sum + (meal.carbsGrams || 0), 0));
  const currentProtein = Math.round(acceptedMeals.reduce((sum, meal) => sum + (meal.proteinGrams || 0), 0));
  const currentFat = Math.round(acceptedMeals.reduce((sum, meal) => sum + (meal.fatGrams || 0), 0));
  const currentCalories = Math.round(acceptedMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0));

  const [carbsMin, carbsMax] = getCarbTarget(dayType, person.weightKg);

  let proteinMin = PROTEIN_TARGET_BAND_FLAT[0];
  let proteinMax = PROTEIN_TARGET_BAND_FLAT[1];
  if (person.weightKg) {
    proteinMin = Math.round(PROTEIN_TARGET_GRAMS_PER_KG[0] * person.weightKg);
    proteinMax = Math.round(PROTEIN_TARGET_GRAMS_PER_KG[1] * person.weightKg);
  }

  let fatMin = FAT_TARGET_BAND_FLAT[0];
  let fatMax = FAT_TARGET_BAND_FLAT[1];
  if (person.weightKg) {
    fatMin = Math.round(FAT_TARGET_GRAMS_PER_KG[0] * person.weightKg);
    fatMax = Math.round(FAT_TARGET_GRAMS_PER_KG[1] * person.weightKg);
  }

  const calorieMin = Math.round(carbsMin * 4 + proteinMin * 4 + fatMin * 9);
  const calorieMax = Math.round(carbsMax * 4 + proteinMax * 4 + fatMax * 9);

  return {
    carbs: { current: currentCarbs, target: [carbsMin, carbsMax] as [number, number] },
    protein: { current: currentProtein, target: [proteinMin, proteinMax] as [number, number] },
    fat: { current: currentFat, target: [fatMin, fatMax] as [number, number] },
    calories: { current: currentCalories, target: [calorieMin, calorieMax] as [number, number] },
  };
}
