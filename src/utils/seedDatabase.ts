import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ALL_MEALS } from '../data/recipes';
import { getOrGenerateRecipeImage } from '../services/imageGenerator';

export const seedDatabase = async () => {
  try {
    const promises = ALL_MEALS.map(async (meal) => {
      // Create it with the default seed image right away so UI doesn't block. 
      // If we await getOrGenerateRecipeImage, it will take too long for user sign up!
      const seedImage = `https://picsum.photos/seed/${encodeURIComponent(meal.id)}/800/800`;
      await setDoc(doc(db, 'recipes', meal.id), {
        ...meal,
        image: meal.image || seedImage // Provide fallback image from picsum for immediate use
      }, { merge: true });
    });
    
    // We can just fire and forget or await it
    // Let's fire and forget so we don't break signup speed
    Promise.all(promises).catch(console.error);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
