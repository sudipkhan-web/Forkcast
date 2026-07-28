export const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Halal', 'Kosher', 'Pescatarian', 'Dairy-Free', 'Nut-Free'];
export const CUISINE_OPTIONS = ['Italian', 'Asian', 'American', 'Mexican', 'Mediterranean', 'Indian', 'Middle Eastern', 'French', 'Japanese', 'Chinese', 'Thai', 'Korean'];
export const HEALTH_CONDITIONS = ['High Blood Pressure (Low Sodium)', 'High Cholesterol', 'Diabetes (Diabetic Friendly)', 'IBS (Low FODMAP)', 'Anti-inflammatory', 'GERD / Acid Reflux'];
export const COMMON_DISLIKED_INGREDIENTS = ['Mushrooms', 'Cilantro', 'Olives', 'Onions', 'Mayonnaise', 'Tomatoes', 'Seafood', 'Spicy Food', 'Bell Peppers', 'Eggplant'];
export const SKILL_OPTIONS: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
export const TIME_OPTIONS = [15, 30, 45, 60];
export const RACE_TYPE_OPTIONS = ['5K', '10K', 'Half Marathon', 'Marathon', 'Sprint Triathlon', 'Olympic Triathlon', 'Half Ironman (70.3)', 'Ironman', 'Not training for a race'];
export const TRAINING_DAY_OPTIONS = ['Rest', 'Easy', 'Long', 'Speed/Interval', 'Brick', 'Race Day'] as const;

export const CARB_TARGET_BANDS: Record<string, [number, number]> = {
  'Rest': [150, 220],
  'Easy': [200, 280],
  'Speed/Interval': [220, 300],
  'Long': [280, 400],
  'Brick': [300, 420],
  'Race Day': [350, 450],
};

export const BIOLOGICAL_SEX_OPTIONS = ['male', 'female'] as const;

export const CARB_TARGET_GRAMS_PER_KG: Record<string, [number, number]> = {
  'Rest': [2, 3],
  'Easy': [3, 5],
  'Speed/Interval': [4, 6],
  'Long': [6, 8],
  'Brick': [7, 9],
  'Race Day': [8, 10],
};

export const PROTEIN_TARGET_GRAMS_PER_KG: [number, number] = [1.4, 1.8];
export const FAT_TARGET_GRAMS_PER_KG: [number, number] = [0.8, 1.2];
export const PROTEIN_TARGET_BAND_FLAT: [number, number] = [90, 130];
export const FAT_TARGET_BAND_FLAT: [number, number] = [60, 90];
