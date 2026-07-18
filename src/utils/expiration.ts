export function estimateExpirationDate(category: string, location: 'fridge' | 'pantry'): string {
  const days = getShelfLifeDays(category, location);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getShelfLifeDays(category: string, location: 'fridge' | 'pantry'): number {
  const normalizedCategory = category.trim().toLowerCase();
  
  if (normalizedCategory === 'dry & baking') return 365;
  if (normalizedCategory === 'pantry staples') return 365;
  if (normalizedCategory === 'spices & seasonings') return 730;
  if (normalizedCategory === 'frozen') return 180;
  if (normalizedCategory === 'snacks') return 120;
  if (normalizedCategory === 'beverages') return 90;

  if (normalizedCategory === 'meat & seafood') {
    return location === 'fridge' ? 3 : 180; // Assuming freezer if not fridge, but default to pantry/freezer
  }
  
  if (normalizedCategory === 'dairy & eggs') {
    return 14;
  }
  
  if (normalizedCategory === 'produce') {
    // Produce in fridge tends to last around a week, in pantry maybe a couple of weeks for things like onions/potatoes.
    return location === 'fridge' ? 7 : 14; 
  }
  
  // Default fallbacks
  return location === 'fridge' ? 7 : 180;
}
