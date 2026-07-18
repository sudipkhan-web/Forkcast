import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { ALL_MEALS } from '../data/recipes';

export enum TrackingAction {
  VIEWED_RECOMMENDATIONS = 'viewed_recommendation_set',
  FAVORITED_RECIPE = 'favorited_recipe',
  REJECTED_RECIPE = 'rejected_recipe',
  REPLACED_RECIPE = 'replaced_recipe',
  SELECTED_RECIPE = 'selected_recipe',
  PLANNED_RECIPE = 'planned_recipe',
  REMOVED_FAVORITE = 'removed_favorite',
}

export interface TrackingEvent {
  uid: string;
  action: TrackingAction;
  recipeId?: string;
  recipeName?: string;
  groupId?: string;
  groupName?: string;
  tags?: string[];
  additionalData?: Record<string, any>;
  timestamp?: any;
}

const updateLearningTags = async (userId: string, action: TrackingAction, recipeId?: string, recipeTags?: string[]) => {
  let tags: string[] = [];
  
  if (recipeTags) {
    tags = [...recipeTags];
  }
  
  if (recipeId) {
    const meal = ALL_MEALS.find(m => m.id === recipeId);
    if (meal) {
      if (!recipeTags && meal.tags) {
        tags = [...meal.tags];
      }
      
      if (action === TrackingAction.FAVORITED_RECIPE) {
        if (meal.cuisine) {
          const cuisineTag = `cuisine:${meal.cuisine.toLowerCase()}`;
          if (!tags.includes(cuisineTag)) tags.push(cuisineTag);
        }
        if (meal.ingredients) {
          meal.ingredients.forEach(ing => {
            const ingTag = `ingredient:${ing.name.toLowerCase()}`;
            if (!tags.includes(ingTag)) tags.push(ingTag);
          });
        }
      }
    }
  }

  if (tags.length === 0) return;

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      const likedTags = data.likedTags || {};
      const dislikedTags = data.dislikedTags || {};
      
      let updated = false;

      tags.forEach(tag => {
        if (action === TrackingAction.FAVORITED_RECIPE || 
            action === TrackingAction.SELECTED_RECIPE || 
            action === TrackingAction.PLANNED_RECIPE) {
          likedTags[tag] = (likedTags[tag] || 0) + 1;
          updated = true;
        } else if (action === TrackingAction.REJECTED_RECIPE || 
                   action === TrackingAction.REPLACED_RECIPE) {
          dislikedTags[tag] = (dislikedTags[tag] || 0) + 1;
          updated = true;
        }
      });

      if (updated) {
        await setDoc(userRef, { likedTags, dislikedTags }, { merge: true });
      }
    }
  } catch (error) {
    console.error('Failed to update learning tags:', error);
  }
};

/**
 * Records a user interaction with recipe suggestions.
 * @param action The type of action performed.
 * @param recipeId The ID of the recipe involved (optional).
 * @param recipeName The name of the recipe involved (optional).
 * @param additionalData Any extra context to log (optional).
 * @param recipeTags The tags of the recipe involved (optional).
 * @param groupId The ID of the selected group (optional).
 * @param groupName The name of the selected group (optional).
 */
export const trackBehavior = async (
  action: TrackingAction,
  recipeId?: string,
  recipeName?: string,
  additionalData?: Record<string, any>,
  recipeTags?: string[],
  groupId?: string,
  groupName?: string
) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return; // Only track if user is logged in

    const event: TrackingEvent = {
      uid: userId,
      action,
      timestamp: serverTimestamp(),
    };

    if (recipeId) event.recipeId = recipeId;
    if (recipeName) event.recipeName = recipeName;
    if (groupId) event.groupId = groupId;
    if (groupName) event.groupName = groupName;
    if (recipeTags) event.tags = recipeTags;
    if (additionalData) event.additionalData = additionalData;

    await addDoc(collection(db, `users/${userId}/behaviorLogs`), event);

    // Adapt future recommendations based on this behavior
    await updateLearningTags(userId, action, recipeId, recipeTags);
  } catch (error) {
    // We don't want tracking errors to break the app, but we should log them
    console.error('Failed to track behavior:', error);
  }
};
