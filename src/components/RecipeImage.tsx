import React, { useEffect, useState } from 'react';
import { Meal } from '../data/recipes';
import { getOrGenerateRecipeImage } from '../services/imageGenerator';

interface RecipeImageProps {
  meal: Meal;
  className?: string;
}

export const RecipeImage: React.FC<RecipeImageProps> = ({ meal, className = '' }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadImage = async () => {
      // If we see it's a pollinations URL, we'll override it with gemini-2.5-flash-image
      // to ensure fast parallel generation and local caching.
      // If it's a completely static non-pollinations external image we could use it directly,
      // but ALL_MEALS uses pollinations too.
      
      try {
        if (meal.image && meal.image.startsWith('data:image')) {
          if (isMounted) setImageUrl(meal.image);
          return;
        }

        const url = await getOrGenerateRecipeImage(meal.id, meal.name, meal.cuisine, meal.details);
        if (isMounted) {
          setImageUrl(url);
          
          if (url.startsWith('data:image')) {
             try {
                const { doc, updateDoc } = await import('firebase/firestore');
                const { db } = await import('../firebase');
                await updateDoc(doc(db, 'recipes', meal.id), { image: url });
             } catch (e) {
                // Not authenticated or permission denied, safe to ignore
             }
          }
        }
      } catch (err) {
        if (isMounted) {
          setImageUrl(`https://picsum.photos/seed/${encodeURIComponent(meal.id)}/800/800`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [meal.id, meal.name, meal.cuisine, meal.details]);

  if (isLoading && !imageUrl) {
    return (
      <div className={`bg-stone-200 animate-pulse flex border border-stone-800 flex-col items-center justify-center text-stone-400 ${className}`}>
        <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl || meal.image || `https://picsum.photos/seed/${meal.id}/800/800`} 
      alt={meal.name} 
      className={className} 
      referrerPolicy="no-referrer" 
    />
  );
};
