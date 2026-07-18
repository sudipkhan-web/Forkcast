# Smart Meal Planner & Inventory Manager

A comprehensive React application designed to help households manage their kitchen inventory, discover personalized recipes, plan meals, and automatically generate smart shopping lists. The app actively works to reduce food waste by prioritizing perishable and soon-to-expire ingredients through intelligent recipe matching and ingredient substitutions.

## Core Features

### 1. Smart Recipe Discovery
- **Inventory Matching:** Suggests meals based on what's currently in your fridge and pantry.
- **Confidence Scoring:** Calculates a "Match" percentage for each recipe based on available ingredients, expiring items, dietary preferences, and cooking time.
- **Intelligent Substitutions:** Automatically suggests "Smart Swaps" for missing ingredients using items you already own. It prioritizes substitutions that are perishable or expiring soon (e.g., swapping missing chicken for tofu if the tofu is expiring).
- **Dynamic Reasoning:** Explains *why* a meal was suggested (e.g., "Uses Spinach which needs to be used soon!").

### 2. Household & Preference Management
- **Profiles:** Manage multiple household members with individual dietary restrictions (Vegetarian, Vegan, Gluten-Free, Keto), disliked ingredients, and favorite cuisines.
- **Groups:** Create groups (e.g., "Kids", "Parents", "Whole Family") to easily plan meals that satisfy everyone's combined constraints.
- **Auto-Adjusting Recipes:** Automatically scales ingredient quantities based on the number of people in the selected group and swaps out incompatible ingredients (e.g., replacing regular pasta with gluten-free pasta).

### 3. Inventory Management
- **Perishable Tracking:** Automatically identifies perishable items and tracks their expiration dates.
- **Visual Indicators:** Highlights items that are expiring soon to encourage immediate use.

### 4. Meal Planning & My Cart
- **Calendar Planning:** Schedule meals for specific days.
- **Automated Shopping List:** Automatically aggregates ingredients needed for planned meals.
- **Smart Filtering:** Excludes ingredients you already have in your inventory or that have been successfully substituted.
- **Buy Later (Defer):** Allows deferring non-perishable items or items needed for later in the week to a "Buy Later" list.
- **Grocery Ordering:** Mock integration for ordering the finalized cart via delivery services like Instacart or Walmart.

## Technical Architecture

- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (`AnimatePresence`, `motion`)
- **Icons:** Lucide React

## Key Algorithms & Logic

### `getSmartSubstitutions`
Evaluates missing ingredients against the user's current inventory. It maps ingredients to categories (e.g., Proteins, Greens, Dairy) and finds available matches. It sorts potential substitutes by perishability and expiration date to minimize food waste.

### `calculateConfidence`
Generates a 0-99 score for how well a recipe fits the current context. Factors include:
- Percentage of ingredients owned (including valid substitutions).
- Presence of expiring ingredients (heavy bonus).
- Match with user's maximum cooking time.
- Match with household's favorite cuisines and liked tags.
- Penalties for violating dietary restrictions or containing disliked ingredients.

### `getAdjustedIngredients`
Takes a base recipe and a list of household members. It scales the ingredient amounts mathematically based on the group size and applies text-replacements for dietary needs (e.g., replacing "Milk" with "Almond Milk" for vegans).

### `combinedShoppingList` (useMemo)
A complex aggregation function that merges manually added shopping items with ingredients required for planned meals. It deduplicates items, sums quantities, tracks the earliest date an item is needed, and explicitly filters out items that the user already has in their `inventory`.

## State Management
The application relies heavily on React's local state (`useState`) and derived state (`useMemo`) to maintain a reactive, client-side data store. Key state objects include `inventory`, `shoppingList`, `plannedMeals`, `household`, `groups`, and `favorites`.
