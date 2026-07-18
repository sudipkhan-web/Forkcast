export type RecipeIngredient = {
  name: string;
  amount: string;
};

export type Meal = {
  id: string;
  name: string;
  image: string;
  time: string;
  timeMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  cuisine: string;
  mealType?: string;
  reason: string;
  details: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  tags: string[];
  isVariation?: boolean;
  baseId?: string;
  dynamicReason?: string;
};

export const ALL_MEALS: Meal[] = [
  { 
    id: '1', name: 'Garlic Butter Pasta', image: 'https://image.pollinations.ai/prompt/professional%20food%20photo%20of%20creamy%20garlic%20butter%20pasta%2C%20garnish%20with%20parsley%2C%20high%20quality%2C%20studio%20lighting?width=800&height=800&nologo=true', time: '15 min', timeMinutes: 15, difficulty: 'Beginner', cuisine: 'Italian', reason: 'Uses ingredients you already have', details: 'A quick and easy pasta dish with garlic, butter, and parmesan.',
    ingredients: [
      { name: 'Pasta', amount: '200g' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Parmesan', amount: '1/4 cup' },
      { name: 'Parsley', amount: '1 tbsp' },
    ],
    steps: [
      'Bring a large pot of generously salted water to a rolling boil. Add the Pasta and cook according to the package instructions until al dente (usually 8-10 minutes). Reserve 1/2 cup of the starchy pasta water before draining.',
      'While the Pasta is cooking, peel and finely mince the Garlic cloves. Wash and finely chop the fresh Parsley.',
      'In a large skillet, melt the Butter over medium-low heat. Add the minced Garlic and sauté gently for 1-2 minutes until fragrant and slightly softened, being careful not to let it brown or burn.',
      'Add the drained Pasta directly into the skillet with the Garlic and Butter. Toss well to coat the noodles evenly.',
      'Gradually sprinkle in the grated Parmesan cheese while tossing the Pasta. If the sauce seems too thick, add a splash of the reserved pasta water to create a smooth, glossy coating.',
      'Remove from heat, garnish with the chopped Parsley, and serve immediately with extra Parmesan on the side if desired.'
    ],
    tags: ['pasta', 'garlic', 'quick', 'vegetarian']
  },
  { 
    id: '2', name: 'Chicken Stir Fry', image: 'https://image.pollinations.ai/prompt/professional%20food%20photo%20of%20chicken%20and%20broccoli%20stir%20fry%20in%20a%20wok%2C%20soy%20sauce%2C%20high%20quality%2C%20studio%20lighting?width=800&height=800&nologo=true', time: '25 min', timeMinutes: 25, difficulty: 'Beginner', cuisine: 'Asian', reason: 'Quick option for tonight', details: 'Healthy chicken breast with broccoli and soy sauce.',
    ingredients: [
      { name: 'Chicken Breast', amount: '2' },
      { name: 'Broccoli', amount: '1 head' },
      { name: 'Soy Sauce', amount: '3 tbsp' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Ginger', amount: '1 tbsp' },
    ],
    steps: [
      'Pat the Chicken Breast dry with paper towels and slice it into thin, bite-sized strips against the grain for maximum tenderness.',
      'Wash the Broccoli and chop it into small, even florets. Peel and mince the Garlic, and peel and grate the fresh Ginger.',
      'Heat a large wok or skillet over medium-high heat with a drizzle of cooking oil. Add the Chicken Breast strips and stir-fry for 5-7 minutes until browned on all sides and cooked through. Remove the chicken from the pan and set aside.',
      'In the same pan, add a little more oil if needed. Add the minced Garlic and grated Ginger, and sauté for 30 seconds until fragrant.',
      'Add the Broccoli florets to the pan along with a splash of water. Cover and steam for 3-4 minutes until the Broccoli is bright green and tender-crisp.',
      'Return the cooked Chicken Breast to the pan. Pour in the Soy Sauce and toss everything together continuously for 1-2 minutes until the sauce coats the ingredients evenly and is heated through. Serve hot.'
    ],
    tags: ['chicken', 'asian', 'healthy', 'quick']
  },
  { 
    id: '3', name: 'Avocado Toast & Egg', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800&h=800', time: '10 min', timeMinutes: 10, difficulty: 'Beginner', cuisine: 'American', reason: 'Based on meals you liked before', details: 'Sourdough bread topped with mashed avocado and a fried egg.',
    ingredients: [
      { name: 'Sourdough Bread', amount: '2 slices' },
      { name: 'Avocado', amount: '1' },
      { name: 'Eggs', amount: '2' },
      { name: 'Salt & Pepper', amount: 'to taste' },
      { name: 'Chili Flakes', amount: '1 tsp' },
    ],
    steps: [
      'Place the slices of Sourdough Bread in a toaster or under a broiler until they are golden brown and crispy on the edges.',
      'While the bread is toasting, cut the Avocado in half, remove the pit, and scoop the flesh into a small bowl. Use a fork to mash it to your desired consistency (chunky or smooth). Season the mashed Avocado with a pinch of Salt & Pepper.',
      'Heat a small non-stick frying pan over medium heat with a light coating of oil or butter. Crack the Eggs into the pan and fry them to your liking (sunny-side up, over-easy, or over-medium).',
      'Spread a thick, even layer of the mashed Avocado over each slice of toasted Sourdough Bread.',
      'Carefully place one fried Egg on top of each avocado-covered toast.',
      'Finish by sprinkling the Chili Flakes and an extra dash of Salt & Pepper over the Eggs. Serve immediately while warm.'
    ],
    tags: ['breakfast', 'vegetarian', 'healthy', 'quick']
  },
  { 
    id: '4', name: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?auto=format&fit=crop&q=80&w=800&h=800', time: '30 min', timeMinutes: 30, difficulty: 'Intermediate', cuisine: 'Italian', reason: 'Comfort food for a Friday', details: 'Classic pizza with tomato sauce, fresh mozzarella, and basil.',
    ingredients: [
      { name: 'Pizza Dough', amount: '1' },
      { name: 'Tomato Sauce', amount: '1/2 cup' },
      { name: 'Fresh Mozzarella', amount: '8 oz' },
      { name: 'Fresh Basil', amount: '1/4 cup' },
      { name: 'Olive Oil', amount: '1 tbsp' },
    ],
    steps: [
      'Preheat your oven to its highest setting, ideally 475°F to 500°F (245°C to 260°C). If using a pizza stone, place it in the oven while it preheats.',
      'Lightly flour a clean work surface. Gently stretch and roll out the Pizza Dough into a 10-12 inch circle, being careful not to deflate the edges too much.',
      'Transfer the stretched Pizza Dough to a piece of parchment paper or a pizza peel dusted with cornmeal.',
      'Spoon the Tomato Sauce onto the center of the dough and use the back of the spoon to spread it out in an even, thin layer, leaving a 1-inch border around the edge for the crust.',
      'Tear the Fresh Mozzarella into bite-sized pieces and distribute them evenly over the Tomato Sauce.',
      'Carefully transfer the pizza to the preheated oven. Bake for 10-12 minutes, or until the crust is deeply golden and the cheese is melted and bubbly with some browned spots.',
      'Remove the pizza from the oven. Immediately scatter the Fresh Basil leaves over the hot pizza and drizzle lightly with the Olive Oil. Slice and serve hot.'
    ],
    tags: ['pizza', 'vegetarian', 'comfort']
  },
  { 
    id: '5', name: 'Beef Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=800&h=800', time: '20 min', timeMinutes: 20, difficulty: 'Beginner', cuisine: 'Mexican', reason: 'Taco Tuesday!', details: 'Ground beef tacos with fresh salsa and cheese.',
    ingredients: [
      { name: 'Ground Beef', amount: '1 lb' },
      { name: 'Taco Shells', amount: '8' },
      { name: 'Taco Seasoning', amount: '2 tbsp' },
      { name: 'Cheddar Cheese', amount: '1 cup' },
      { name: 'Lettuce', amount: '1 cup' },
      { name: 'Tomato', amount: '1' }
    ],
    steps: [
      'Heat a large skillet over medium-high heat. Add the Ground Beef, breaking it apart with a wooden spoon as it cooks. Cook for 5-7 minutes until completely browned and no pink remains.',
      'Carefully drain any excess fat from the skillet.',
      'Sprinkle the Taco Seasoning evenly over the cooked Ground Beef. Add about 1/4 cup of water to the skillet. Stir well to combine and let it simmer for 3-5 minutes until the sauce has thickened and coated the meat.',
      'While the beef is simmering, preheat your oven to 350°F (175°C). Arrange the Taco Shells on a baking sheet and warm them in the oven for 3-5 minutes until crisp.',
      'Prepare your toppings: shred the Lettuce, dice the Tomato, and grate the Cheddar Cheese if it is not pre-shredded.',
      'Assemble the tacos by spooning a generous amount of the seasoned Ground Beef into each warm Taco Shell. Top with the shredded Cheddar Cheese, Lettuce, and diced Tomato. Serve immediately.'
    ],
    tags: ['beef', 'mexican', 'quick', 'family']
  },
  {
    id: '6', name: 'Vegetable Curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800&h=800', time: '35 min', timeMinutes: 35, difficulty: 'Intermediate', cuisine: 'Indian', reason: 'Healthy and warming', details: 'A rich and creamy coconut curry loaded with mixed vegetables.',
    ingredients: [
      { name: 'Mixed Vegetables', amount: '3 cups' },
      { name: 'Coconut Milk', amount: '1 can' },
      { name: 'Curry Paste', amount: '2 tbsp' },
      { name: 'Onion', amount: '1' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Ginger', amount: '1 tbsp' }
    ],
    steps: [
      'Prepare your aromatics: finely dice the Onion, mince the Garlic cloves, and peel and grate the Ginger.',
      'Heat a tablespoon of oil in a large pot or Dutch oven over medium heat. Add the diced Onion and sauté for 4-5 minutes until softened and translucent.',
      'Add the minced Garlic and grated Ginger to the pot. Cook for another 1-2 minutes, stirring frequently, until very fragrant.',
      'Stir in the Curry Paste, mixing it well with the aromatics. Let it cook for 1 minute to release its oils and deepen the flavor.',
      'Pour in the can of Coconut Milk, stirring constantly to dissolve the Curry Paste into a smooth, creamy sauce. Bring the mixture to a gentle simmer.',
      'Add the Mixed Vegetables to the simmering curry sauce. Stir to coat them evenly.',
      'Cover the pot, reduce the heat to low, and let it simmer for 15-20 minutes, or until all the Mixed Vegetables are tender. Taste and adjust seasoning if necessary. Serve hot over rice.'
    ],
    tags: ['vegan', 'curry', 'indian', 'healthy']
  },
  {
    id: '7', name: 'Grilled Salmon', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800&h=800', time: '20 min', timeMinutes: 20, difficulty: 'Intermediate', cuisine: 'American', reason: 'High in Omega-3', details: 'Perfectly grilled salmon fillets with lemon and herbs.',
    ingredients: [
      { name: 'Salmon Fillets', amount: '2' },
      { name: 'Lemon', amount: '1' },
      { name: 'Olive Oil', amount: '2 tbsp' },
      { name: 'Dill', amount: '1 tbsp' },
      { name: 'Salt & Pepper', amount: 'to taste' }
    ],
    steps: [
      'Preheat your outdoor grill or an indoor grill pan to medium-high heat (about 400°F/200°C). Lightly oil the grill grates to prevent sticking.',
      'Pat the Salmon Fillets completely dry with paper towels. This helps achieve a good sear.',
      'Brush both sides of the Salmon Fillets generously with Olive Oil. Season evenly with Salt & Pepper.',
      'Place the Salmon Fillets on the hot grill, skin-side down (if they have skin). Grill undisturbed for 6-8 minutes. You should see the flesh turning opaque from the bottom up.',
      'Carefully slide a thin spatula under the salmon and flip it over. Grill for an additional 2-4 minutes on the other side, depending on your preferred level of doneness.',
      'Remove the Salmon Fillets from the grill and let them rest for 2 minutes.',
      'Chop the fresh Dill. Squeeze half of the Lemon over the grilled salmon and garnish with the chopped Dill. Cut the remaining Lemon half into wedges for serving.'
    ],
    tags: ['seafood', 'healthy', 'quick', 'keto']
  },
  {
    id: '8', name: 'Mushroom Risotto', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800&h=800', time: '45 min', timeMinutes: 45, difficulty: 'Advanced', cuisine: 'Italian', reason: 'Impress your guests', details: 'Creamy Arborio rice cooked slowly with savory mushrooms and parmesan.',
    ingredients: [
      { name: 'Arborio Rice', amount: '1 cup' },
      { name: 'Mushrooms', amount: '8 oz' },
      { name: 'Vegetable Broth', amount: '4 cups' },
      { name: 'White Wine', amount: '1/2 cup' },
      { name: 'Parmesan', amount: '1/2 cup' },
      { name: 'Onion', amount: '1' }
    ],
    steps: [
      'Pour the Vegetable Broth into a medium saucepan and bring it to a gentle simmer over low heat. Keep it warm throughout the cooking process.',
      'Finely dice the Onion and slice the Mushrooms. Grate the Parmesan cheese.',
      'In a large, heavy-bottomed pot or Dutch oven, heat a tablespoon of olive oil or butter over medium heat. Add the diced Onion and sauté until translucent, about 3-4 minutes.',
      'Add the sliced Mushrooms to the pot and cook until they have released their moisture and browned nicely, about 5-7 minutes.',
      'Add the Arborio Rice to the pot. Stir constantly for 1-2 minutes until the edges of the rice grains become slightly translucent (toasting the rice).',
      'Pour in the White Wine and stir continuously until the liquid is almost completely absorbed by the rice.',
      'Begin adding the warm Vegetable Broth one ladleful (about 1/2 cup) at a time. Stir frequently and wait until the liquid is mostly absorbed before adding the next ladle. This process should take about 20-25 minutes. The rice should be tender but still have a slight bite (al dente), and the mixture should be creamy.',
      'Remove the pot from the heat. Vigorously stir in the grated Parmesan cheese. Taste and adjust seasoning with salt and pepper. Serve immediately in warm bowls.'
    ],
    tags: ['vegetarian', 'italian', 'comfort']
  },
  {
    id: '9', name: 'Greek Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800&h=800', time: '10 min', timeMinutes: 10, difficulty: 'Beginner', cuisine: 'Mediterranean', reason: 'Fresh and light', details: 'Crisp cucumbers, tomatoes, feta, and olives in a light vinaigrette.',
    ingredients: [
      { name: 'Cucumber', amount: '1' },
      { name: 'Tomatoes', amount: '2' },
      { name: 'Red Onion', amount: '1/2' },
      { name: 'Kalamata Olives', amount: '1/2 cup' },
      { name: 'Feta Cheese', amount: '4 oz' },
      { name: 'Olive Oil', amount: '3 tbsp' }
    ],
    steps: [
      'Wash the Cucumber and Tomatoes. Cut the Cucumber into thick half-moons and chop the Tomatoes into large, bite-sized wedges or chunks.',
      'Peel the Red Onion and slice it very thinly. If the onion is too pungent, you can soak the slices in cold water for 5 minutes, then drain well.',
      'In a large serving bowl, combine the chopped Cucumber, Tomatoes, and sliced Red Onion.',
      'Add the Kalamata Olives to the bowl. If they have pits, you can leave them whole or pit them before adding.',
      'Cut the Feta Cheese into large cubes or crumble it into thick pieces. Gently place the cheese on top of the salad mixture.',
      'Drizzle the Olive Oil generously over the entire salad. Add a splash of red wine vinegar or lemon juice if desired, and sprinkle with dried oregano, salt, and pepper. Gently toss right before serving to keep the vegetables crisp.'
    ],
    tags: ['salad', 'vegetarian', 'healthy', 'quick', 'mediterranean']
  },
  {
    id: '10', name: 'Pancakes', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=800&h=800', time: '20 min', timeMinutes: 20, difficulty: 'Beginner', cuisine: 'American', reason: 'Weekend breakfast', details: 'Fluffy buttermilk pancakes served with maple syrup.',
    ingredients: [
      { name: 'Flour', amount: '1.5 cups' },
      { name: 'Milk', amount: '1.25 cups' },
      { name: 'Egg', amount: '1' },
      { name: 'Butter', amount: '3 tbsp' },
      { name: 'Baking Powder', amount: '3.5 tsp' },
      { name: 'Maple Syrup', amount: 'to serve' }
    ],
    steps: [
      'In a large mixing bowl, whisk together the Flour, Baking Powder, and a pinch of salt until well combined.',
      'Melt the Butter in the microwave or on the stove and let it cool slightly. In a separate medium bowl, whisk together the Milk, Egg, and the melted Butter.',
      'Pour the wet ingredients into the dry ingredients. Use a spatula or whisk to gently fold the mixture together. Do not overmix; it is okay if the batter is slightly lumpy. Overmixing will make the pancakes tough.',
      'Heat a large skillet or griddle over medium heat. Lightly grease the surface with a little butter or cooking spray.',
      'Pour about 1/4 cup of the batter onto the hot griddle for each pancake. Space them out so they have room to spread.',
      'Cook for 2-3 minutes, or until bubbles form on the surface of the pancakes and the edges look set and slightly dry.',
      'Carefully flip the pancakes with a spatula and cook for another 1-2 minutes on the other side until golden brown and cooked through.',
      'Serve the pancakes warm, stacked high, and generously drizzled with Maple Syrup.'
    ],
    tags: ['breakfast', 'sweet', 'comfort']
  },
  {
    id: '11', name: 'Caprese Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800&h=800', time: '10 min', timeMinutes: 10, difficulty: 'Beginner', cuisine: 'Italian', reason: 'Quick lunch', details: 'Fresh mozzarella, tomatoes, and basil pesto on ciabatta bread.',
    ingredients: [
      { name: 'Ciabatta Bread', amount: '1 roll' },
      { name: 'Fresh Mozzarella', amount: '3 oz' },
      { name: 'Tomato', amount: '1/2' },
      { name: 'Basil Pesto', amount: '2 tbsp' },
      { name: 'Balsamic Glaze', amount: '1 tbsp' }
    ],
    steps: [
      'Using a serrated bread knife, carefully slice the Ciabatta Bread roll in half horizontally.',
      'Spread a generous, even layer of the Basil Pesto onto the cut sides of both the top and bottom halves of the bread.',
      'Slice the Fresh Mozzarella into thick rounds. Wash and slice the Tomato into rounds of a similar thickness.',
      'Layer the sliced Fresh Mozzarella and Tomato alternately on the bottom half of the Ciabatta Bread.',
      'Drizzle the Balsamic Glaze evenly over the layered cheese and tomatoes. Add a pinch of salt and freshly ground black pepper if desired.',
      'Place the top half of the Ciabatta Bread over the fillings and press down gently. Serve immediately, or wrap tightly for a packed lunch.'
    ],
    tags: ['lunch', 'vegetarian', 'quick', 'italian']
  },
  {
    id: '12', name: 'Lentil Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800&h=800', time: '40 min', timeMinutes: 40, difficulty: 'Beginner', cuisine: 'Mediterranean', reason: 'Hearty and nutritious', details: 'A warm, comforting soup packed with protein-rich lentils and veggies.',
    ingredients: [
      { name: 'Brown Lentils', amount: '1 cup' },
      { name: 'Carrots', amount: '2' },
      { name: 'Celery', amount: '2 stalks' },
      { name: 'Onion', amount: '1' },
      { name: 'Vegetable Broth', amount: '4 cups' },
      { name: 'Cumin', amount: '1 tsp' }
    ],
    steps: [
      'Rinse the Brown Lentils thoroughly under cold running water and pick out any debris. Set aside.',
      'Prepare the mirepoix: peel and finely dice the Carrots and Onion. Wash and finely dice the Celery stalks.',
      'Heat a tablespoon of olive oil in a large pot or Dutch oven over medium heat. Add the diced Carrots, Celery, and Onion. Sauté for 6-8 minutes until the vegetables are softened and the onion is translucent.',
      'Stir in the Cumin and cook for 1 minute until fragrant.',
      'Add the rinsed Brown Lentils to the pot, followed by the Vegetable Broth. Stir well to combine.',
      'Bring the soup to a rolling boil. Once boiling, reduce the heat to low, cover the pot with a lid, and let it simmer gently for 25-30 minutes, or until the lentils are tender but not mushy.',
      'Taste the soup and season generously with salt and pepper. If the soup is too thick, add a little more water or broth. Serve hot with crusty bread.'
    ],
    tags: ['soup', 'vegan', 'healthy', 'comfort']
  },
  {
    id: '13', name: 'Shrimp Scampi', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800&h=800', time: '20 min', timeMinutes: 20, difficulty: 'Intermediate', cuisine: 'Italian', reason: 'Elegant yet fast', details: 'Juicy shrimp cooked in a garlic, butter, and white wine sauce over linguine.',
    ingredients: [
      { name: 'Linguine', amount: '8 oz' },
      { name: 'Shrimp', amount: '1 lb' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Butter', amount: '4 tbsp' },
      { name: 'White Wine', amount: '1/4 cup' },
      { name: 'Lemon Juice', amount: '2 tbsp' }
    ],
    steps: [
      'Bring a large pot of salted water to a boil. Add the Linguine and cook according to package directions until al dente. Drain, reserving 1/4 cup of the pasta water.',
      'While the pasta cooks, peel and mince the Garlic cloves. If your Shrimp are not pre-peeled, peel and devein them, and pat them completely dry with paper towels.',
      'In a large skillet, melt 2 tablespoons of the Butter over medium heat. Add the minced Garlic and sauté for 30-60 seconds until fragrant, being careful not to brown it.',
      'Add the Shrimp to the skillet in a single layer. Season with salt and pepper. Cook for 1-2 minutes per side until they turn pink and opaque. Remove the Shrimp from the skillet and set aside on a plate.',
      'In the same skillet, pour in the White Wine and Lemon Juice. Increase the heat to medium-high and let the liquid simmer and reduce by half, scraping up any browned bits from the bottom of the pan.',
      'Reduce the heat to low and whisk in the remaining 2 tablespoons of Butter until the sauce is smooth and emulsified.',
      'Return the cooked Shrimp to the skillet along with the cooked Linguine. Toss everything together in the garlic butter sauce. If the pasta seems dry, add a splash of the reserved pasta water. Serve immediately, garnished with fresh parsley if desired.'
    ],
    tags: ['seafood', 'pasta', 'italian', 'quick']
  },
  {
    id: '14', name: 'Oatmeal with Berries', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=800&h=800', time: '10 min', timeMinutes: 10, difficulty: 'Beginner', cuisine: 'American', reason: 'Healthy start', details: 'Warm rolled oats topped with fresh mixed berries and honey.',
    ingredients: [
      { name: 'Rolled Oats', amount: '1/2 cup' },
      { name: 'Milk or Water', amount: '1 cup' },
      { name: 'Mixed Berries', amount: '1/2 cup' },
      { name: 'Honey', amount: '1 tbsp' },
      { name: 'Cinnamon', amount: '1/2 tsp' }
    ],
    steps: [
      'In a small saucepan, combine the Rolled Oats and your choice of Milk or Water. Add a tiny pinch of salt to enhance the flavor.',
      'Place the saucepan over medium-high heat and bring the mixture to a gentle boil.',
      'Once boiling, immediately reduce the heat to low. Let the oats simmer uncovered for 5-7 minutes, stirring occasionally to prevent sticking, until the liquid is absorbed and the oats are tender and creamy.',
      'Remove the saucepan from the heat. Stir in the Cinnamon.',
      'Transfer the cooked oatmeal to a serving bowl.',
      'Wash the Mixed Berries and arrange them generously over the top of the warm oatmeal.',
      'Drizzle the Honey evenly over the berries and oatmeal. Serve warm.'
    ],
    tags: ['breakfast', 'healthy', 'quick', 'vegetarian']
  },
  {
    id: '15', name: 'BBQ Chicken Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800&h=800', time: '25 min', timeMinutes: 25, difficulty: 'Intermediate', cuisine: 'American', reason: 'Fun dinner', details: 'Pizza topped with BBQ sauce, chicken, red onion, and cilantro.',
    ingredients: [
      { name: 'Pizza Dough', amount: '1' },
      { name: 'BBQ Sauce', amount: '1/2 cup' },
      { name: 'Cooked Chicken', amount: '1 cup' },
      { name: 'Red Onion', amount: '1/4' },
      { name: 'Mozzarella', amount: '1 cup' },
      { name: 'Cilantro', amount: '2 tbsp' }
    ],
    steps: [
      'Preheat your oven to 475°F (245°C). If using a pizza stone, ensure it is in the oven while preheating.',
      'Shred or chop the Cooked Chicken into bite-sized pieces. Thinly slice the Red Onion. Grate the Mozzarella cheese.',
      'In a small bowl, toss the shredded Cooked Chicken with 2 tablespoons of the BBQ Sauce to coat it evenly.',
      'Roll or stretch out the Pizza Dough on a floured surface to your desired thickness and transfer it to a parchment-lined baking sheet or a pizza peel.',
      'Spread the remaining BBQ Sauce evenly over the Pizza Dough, leaving a small border for the crust.',
      'Sprinkle half of the grated Mozzarella cheese over the sauce. Distribute the BBQ-coated Cooked Chicken and sliced Red Onion evenly across the pizza. Top with the remaining Mozzarella.',
      'Bake in the preheated oven for 10-14 minutes, or until the crust is golden brown and the cheese is melted and bubbly.',
      'Remove the pizza from the oven. Roughly chop the fresh Cilantro and scatter it over the hot pizza before slicing and serving.'
    ],
    tags: ['pizza', 'chicken', 'comfort']
  },
  {
    id: '16', name: 'Tofu Stir Fry', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800&h=800', time: '25 min', timeMinutes: 25, difficulty: 'Beginner', cuisine: 'Asian', reason: 'Plant-based protein', details: 'Crispy tofu cubes with mixed vegetables in a savory sauce.',
    ingredients: [
      { name: 'Firm Tofu', amount: '1 block' },
      { name: 'Bell Pepper', amount: '1' },
      { name: 'Snap Peas', amount: '1 cup' },
      { name: 'Soy Sauce', amount: '3 tbsp' },
      { name: 'Sesame Oil', amount: '1 tbsp' },
      { name: 'Cornstarch', amount: '1 tbsp' }
    ],
    steps: [
      'Drain the Firm Tofu and press it gently between paper towels or clean kitchen towels for 10-15 minutes to remove excess moisture. Cut the pressed tofu into 1-inch cubes.',
      'Place the tofu cubes in a bowl and sprinkle the Cornstarch over them. Toss gently until all the cubes are evenly coated.',
      'Wash the Bell Pepper and Snap Peas. Remove the seeds from the Bell Pepper and slice it into thin strips. Trim the ends off the Snap Peas.',
      'Heat the Sesame Oil in a large wok or non-stick skillet over medium-high heat. Add the cornstarch-coated tofu cubes in a single layer. Pan-fry for 2-3 minutes per side until golden brown and crispy all over. Remove the tofu from the pan and set aside.',
      'In the same pan, add a little more oil if necessary. Add the sliced Bell Pepper and Snap Peas. Stir-fry for 3-4 minutes until the vegetables are tender-crisp and brightly colored.',
      'Return the crispy tofu to the pan with the vegetables. Pour the Soy Sauce over the mixture and toss everything together continuously for 1-2 minutes until heated through and well combined. Serve immediately over rice or noodles.'
    ],
    tags: ['vegan', 'asian', 'healthy', 'quick']
  },
  {
    id: '17', name: 'Steak Fajitas', image: 'https://images.unsplash.com/photo-1574781330855-d0db8ce60179?auto=format&fit=crop&q=80&w=800&h=800', time: '30 min', timeMinutes: 30, difficulty: 'Intermediate', cuisine: 'Mexican', reason: 'Sizzling dinner', details: 'Marinated flank steak strips with sautéed peppers and onions.',
    ingredients: [
      { name: 'Flank Steak', amount: '1 lb' },
      { name: 'Bell Peppers', amount: '2' },
      { name: 'Onion', amount: '1' },
      { name: 'Fajita Seasoning', amount: '2 tbsp' },
      { name: 'Tortillas', amount: '8' },
      { name: 'Lime', amount: '1' }
    ],
    steps: [
      'Slice the Flank Steak against the grain into thin strips. Place the strips in a bowl and toss them with the Fajita Seasoning and the juice of half the Lime. Let it marinate while you prepare the vegetables.',
      'Core and slice the Bell Peppers into thin strips. Peel and slice the Onion into thin half-moons.',
      'Heat a large cast-iron skillet or heavy-bottomed pan over high heat until very hot. Add a drizzle of oil.',
      'Add the marinated Flank Steak strips to the hot skillet in a single layer. Sear quickly for 1-2 minutes per side until browned but still slightly pink in the center. Remove the steak from the skillet and set aside on a plate.',
      'In the same skillet, add a little more oil. Add the sliced Bell Peppers and Onion. Sauté over medium-high heat for 5-7 minutes, stirring frequently, until the vegetables are softened and have slightly charred edges.',
      'Return the seared steak (and any resting juices) to the skillet with the vegetables. Toss everything together for 1 minute to reheat the meat.',
      'Warm the Tortillas in a dry skillet or in the microwave. Serve the sizzling steak and vegetable mixture immediately with the warm Tortillas and wedges from the remaining half of the Lime.'
    ],
    tags: ['beef', 'mexican', 'family']
  },
  {
    id: '18', name: 'Quinoa Salad', image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=800&h=800', time: '20 min', timeMinutes: 20, difficulty: 'Beginner', cuisine: 'Mediterranean', reason: 'Meal prep friendly', details: 'Fluffy quinoa mixed with cucumber, tomatoes, feta, and a lemon dressing.',
    ingredients: [
      { name: 'Quinoa', amount: '1 cup' },
      { name: 'Cucumber', amount: '1' },
      { name: 'Cherry Tomatoes', amount: '1 cup' },
      { name: 'Feta Cheese', amount: '1/2 cup' },
      { name: 'Lemon Juice', amount: '2 tbsp' },
      { name: 'Olive Oil', amount: '2 tbsp' }
    ],
    steps: [
      'Rinse the Quinoa thoroughly in a fine-mesh sieve under cold water to remove its natural bitter coating.',
      'In a medium saucepan, combine the rinsed Quinoa with 2 cups of water or vegetable broth. Bring to a boil, then reduce heat to low, cover, and simmer for 15 minutes until the liquid is absorbed and the quinoa is fluffy. Remove from heat and let it cool to room temperature.',
      'While the quinoa cools, prepare the vegetables. Wash and dice the Cucumber. Wash and halve the Cherry Tomatoes. Crumble the Feta Cheese.',
      'In a small bowl or jar, whisk together the Lemon Juice, Olive Oil, a pinch of salt, and freshly ground black pepper to create the dressing.',
      'In a large serving bowl, combine the cooled Quinoa, diced Cucumber, halved Cherry Tomatoes, and crumbled Feta Cheese.',
      'Pour the lemon-olive oil dressing over the salad ingredients. Toss gently but thoroughly to ensure everything is evenly coated. Serve immediately or chill in the refrigerator for later.'
    ],
    tags: ['salad', 'vegetarian', 'healthy', 'meal-prep']
  },
  {
    id: '19', name: 'Chicken Parmesan', image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&q=80&w=800&h=800', time: '40 min', timeMinutes: 40, difficulty: 'Intermediate', cuisine: 'Italian', reason: 'Classic comfort', details: 'Breaded chicken breast topped with marinara and melted mozzarella.',
    ingredients: [
      { name: 'Chicken Breast', amount: '2' },
      { name: 'Breadcrumbs', amount: '1 cup' },
      { name: 'Egg', amount: '1' },
      { name: 'Marinara Sauce', amount: '1 cup' },
      { name: 'Mozzarella', amount: '1/2 cup' },
      { name: 'Parmesan', amount: '1/4 cup' }
    ],
    steps: [
      'Preheat your oven to 400°F (200°C). Lightly grease a baking dish.',
      'Slice the Chicken Breasts in half horizontally to create four thinner cutlets. If they are still thick, pound them gently to an even 1/2-inch thickness.',
      'Set up a breading station: In one shallow bowl, beat the Egg. In another shallow bowl, mix the Breadcrumbs with the grated Parmesan cheese, salt, and pepper.',
      'Dip each chicken cutlet first into the beaten Egg, letting excess drip off, then press it firmly into the breadcrumb mixture to coat both sides completely.',
      'Heat a large skillet over medium-high heat with enough oil to coat the bottom. Pan-fry the breaded chicken cutlets for 3-4 minutes per side until golden brown and crispy. They do not need to be fully cooked through at this stage.',
      'Transfer the browned chicken cutlets to the prepared baking dish. Spoon a generous layer of Marinara Sauce over each cutlet, then top evenly with the shredded Mozzarella cheese.',
      'Bake in the preheated oven for 15-20 minutes, or until the chicken is cooked through (internal temperature reaches 165°F) and the cheese is melted, bubbly, and slightly browned. Serve hot.'
    ],
    tags: ['chicken', 'italian', 'comfort']
  },
  {
    id: '20', name: 'Smoothie Bowl', image: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&q=80&w=800&h=800', time: '10 min', timeMinutes: 10, difficulty: 'Beginner', cuisine: 'American', reason: 'Refreshing breakfast', details: 'Thick berry smoothie topped with granola, chia seeds, and fresh fruit.',
    ingredients: [
      { name: 'Frozen Berries', amount: '1 cup' },
      { name: 'Banana', amount: '1' },
      { name: 'Almond Milk', amount: '1/2 cup' },
      { name: 'Granola', amount: '1/4 cup' },
      { name: 'Chia Seeds', amount: '1 tbsp' }
    ],
    steps: [
      'Peel the Banana. If you prefer a thicker smoothie bowl, use a frozen banana.',
      'In a high-speed blender, combine the Frozen Berries, the peeled Banana, and the Almond Milk.',
      'Blend on high until the mixture is completely smooth and very thick. You may need to stop and scrape down the sides of the blender or use a tamper to keep the mixture moving. If it is too thick to blend, add a tiny splash more Almond Milk, but keep it as thick as possible.',
      'Pour the thick smoothie mixture into a wide, shallow serving bowl.',
      'Arrange the Granola and Chia Seeds in neat lines or sections over the top of the smoothie.',
      'Add any additional toppings you like, such as fresh sliced fruit, coconut flakes, or a drizzle of nut butter. Serve immediately with a spoon.'
    ],
    tags: ['breakfast', 'vegan', 'healthy', 'quick']
  },
  {
    id: '21', name: 'Salmon Avocado Roll', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800&h=800', time: '40 min', timeMinutes: 40, difficulty: 'Intermediate', cuisine: 'Japanese', reason: 'Fresh and healthy', details: 'Homemade sushi rolls with fresh salmon and creamy avocado.',
    ingredients: [
      { name: 'Sushi Rice', amount: '1 cup' },
      { name: 'Nori Seaweed', amount: '2 sheets' },
      { name: 'Fresh Salmon', amount: '100g' },
      { name: 'Avocado', amount: '1/2' },
      { name: 'Soy Sauce', amount: '2 tbsp' }
    ],
    steps: [
      'Rinse the Sushi Rice thoroughly until the water runs clear. Cook according to package instructions, then let it cool slightly and mix with a splash of sushi vinegar if desired.',
      'Slice the Fresh Salmon into long, thin strips. Peel and slice the Avocado into similar strips.',
      'Place a sheet of Nori Seaweed shiny side down on a bamboo sushi mat. Wet your hands to prevent sticking, and spread a thin, even layer of Sushi Rice over the Nori, leaving a 1-inch border at the top.',
      'Arrange the Salmon and Avocado strips horizontally across the center of the rice.',
      'Using the bamboo mat, carefully roll the sushi tightly from the bottom up, applying gentle pressure. Wet the top border of the Nori slightly to seal the roll.',
      'Using a sharp, wet knife, slice the roll into 6-8 pieces. Serve immediately with Soy Sauce.'
    ],
    tags: ['seafood', 'japanese', 'healthy', 'pescatarian']
  },
  {
    id: '22', name: 'Greek Chicken Souvlaki', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800&h=800', time: '35 min', timeMinutes: 35, difficulty: 'Intermediate', cuisine: 'Greek', reason: 'Mediterranean flavors', details: 'Grilled chicken skewers marinated in lemon, garlic, and oregano.',
    ingredients: [
      { name: 'Chicken Breast', amount: '2' },
      { name: 'Lemon', amount: '1' },
      { name: 'Olive Oil', amount: '3 tbsp' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Dried Oregano', amount: '1 tbsp' }
    ],
    steps: [
      'Cut the Chicken Breast into bite-sized cubes.',
      'In a bowl, whisk together the juice of the Lemon, Olive Oil, minced Garlic, and Dried Oregano to create the marinade.',
      'Add the chicken cubes to the marinade, toss to coat well, and let it sit for at least 20 minutes (or up to 2 hours in the fridge).',
      'Thread the marinated chicken onto skewers (if using wooden skewers, soak them in water for 30 minutes first).',
      'Preheat a grill or grill pan over medium-high heat. Cook the skewers for 10-12 minutes, turning occasionally, until the chicken is cooked through and slightly charred.',
      'Serve hot with pita bread, tzatziki sauce, and a fresh Greek salad.'
    ],
    tags: ['chicken', 'greek', 'healthy', 'high-protein', 'mediterranean']
  },
  {
    id: '23', name: 'Mushroom Risotto', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db378?auto=format&fit=crop&q=80&w=800&h=800', time: '45 min', timeMinutes: 45, difficulty: 'Advanced', cuisine: 'Italian', reason: 'Rich and comforting', details: 'Creamy Arborio rice slowly cooked with earthy mushrooms and parmesan.',
    ingredients: [
      { name: 'Arborio Rice', amount: '1 cup' },
      { name: 'Mushrooms', amount: '200g' },
      { name: 'Vegetable Broth', amount: '4 cups' },
      { name: 'Onion', amount: '1/2' },
      { name: 'Parmesan', amount: '1/2 cup' }
    ],
    steps: [
      'In a medium saucepan, bring the Vegetable Broth to a gentle simmer and keep it warm over low heat.',
      'Finely chop the Onion and slice the Mushrooms. In a large heavy-bottomed pan, sauté the Onion in a little olive oil or butter until translucent.',
      'Add the sliced Mushrooms and cook until they release their moisture and brown slightly.',
      'Stir in the Arborio Rice and toast it for 1-2 minutes until the edges become slightly translucent.',
      'Begin adding the warm Vegetable Broth one ladle at a time, stirring constantly. Wait until each ladle of broth is almost fully absorbed before adding the next.',
      'Continue this process for about 20-25 minutes until the rice is creamy and al dente. Remove from heat, stir in the grated Parmesan, and serve immediately.'
    ],
    tags: ['vegetarian', 'italian', 'comfort', 'rice']
  },
  {
    id: '24', name: 'Spicy Tofu Curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800&h=800', time: '30 min', timeMinutes: 30, difficulty: 'Intermediate', cuisine: 'Indian', reason: 'Flavorful plant-based meal', details: 'Crispy tofu cubes simmered in a rich, spicy coconut curry sauce.',
    ingredients: [
      { name: 'Firm Tofu', amount: '1 block' },
      { name: 'Coconut Milk', amount: '1 can' },
      { name: 'Curry Paste', amount: '2 tbsp' },
      { name: 'Bell Pepper', amount: '1' },
      { name: 'Spinach', amount: '2 cups' }
    ],
    steps: [
      'Press the Firm Tofu to remove excess water, then cut it into bite-sized cubes. Slice the Bell Pepper into strips.',
      'In a large skillet, pan-fry the tofu cubes in a little oil over medium-high heat until golden and crispy on all sides. Remove and set aside.',
      'In the same skillet, add the Curry Paste and cook for 1 minute until fragrant.',
      'Pour in the Coconut Milk and stir well to combine with the curry paste. Bring to a gentle simmer.',
      'Add the sliced Bell Pepper and simmer for 5-7 minutes until slightly tender.',
      'Stir in the crispy tofu and fresh Spinach. Cook for another 2 minutes until the spinach is wilted. Serve hot over rice.'
    ],
    tags: ['vegan', 'indian', 'curry', 'spicy', 'healthy']
  },
  {
    id: '25', name: 'Classic Cheeseburger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800&h=800', time: '20 min', timeMinutes: 20, difficulty: 'Beginner', cuisine: 'American', reason: 'Ultimate comfort food', details: 'Juicy beef patty topped with melted cheese, lettuce, and tomato on a toasted bun.',
    ingredients: [
      { name: 'Ground Beef', amount: '400g' },
      { name: 'Burger Buns', amount: '2' },
      { name: 'Cheddar Cheese', amount: '2 slices' },
      { name: 'Lettuce', amount: '2 leaves' },
      { name: 'Tomato', amount: '1' }
    ],
    steps: [
      'Divide the Ground Beef into two equal portions and gently form them into patties slightly larger than the Burger Buns. Season generously with salt and pepper.',
      'Slice the Tomato and wash the Lettuce leaves.',
      'Heat a cast-iron skillet or grill over medium-high heat. Add the patties and cook for 3-4 minutes on the first side until a nice crust forms.',
      'Flip the patties, immediately place a slice of Cheddar Cheese on each, and cook for another 3-4 minutes for medium doneness.',
      'While the burgers are cooking, lightly toast the Burger Buns.',
      'Assemble the burgers: place the lettuce and tomato on the bottom bun, top with the cheesy patty, add your favorite condiments, and cover with the top bun.'
    ],
    tags: ['beef', 'american', 'comfort', 'quick']
  },
  {
    id: '26', name: 'Quinoa Salad Bowl', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800&h=800', time: '25 min', timeMinutes: 25, difficulty: 'Beginner', cuisine: 'Mediterranean', reason: 'Nutrient-dense lunch', details: 'A healthy bowl packed with protein-rich quinoa, fresh veggies, and a lemon vinaigrette.',
    ingredients: [
      { name: 'Quinoa', amount: '1 cup' },
      { name: 'Cucumber', amount: '1' },
      { name: 'Cherry Tomatoes', amount: '1 cup' },
      { name: 'Feta Cheese', amount: '1/4 cup' },
      { name: 'Lemon', amount: '1' }
    ],
    steps: [
      'Rinse the Quinoa thoroughly. In a medium pot, combine the quinoa with 2 cups of water or broth. Bring to a boil, then reduce heat, cover, and simmer for 15 minutes until the liquid is absorbed.',
      'While the quinoa cooks, dice the Cucumber and halve the Cherry Tomatoes.',
      'Once the quinoa is done, fluff it with a fork and let it cool slightly.',
      'In a large bowl, combine the cooked quinoa, diced cucumber, and cherry tomatoes.',
      'Squeeze the juice of the Lemon over the salad, drizzle with a little olive oil, and toss well.',
      'Crumble the Feta Cheese over the top and serve immediately or chill for later.'
    ],
    tags: ['vegetarian', 'healthy', 'salad', 'meal-prep', 'mediterranean']
  },
  {
    id: '27', name: 'Shrimp Scampi', image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&q=80&w=800&h=800', time: '20 min', timeMinutes: 20, difficulty: 'Intermediate', cuisine: 'Italian', reason: 'Elegant but quick', details: 'Plump shrimp sautéed in a garlic, butter, and white wine sauce over linguine.',
    ingredients: [
      { name: 'Shrimp', amount: '300g' },
      { name: 'Linguine', amount: '200g' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Butter', amount: '3 tbsp' },
      { name: 'Lemon', amount: '1' }
    ],
    steps: [
      'Bring a large pot of salted water to a boil and cook the Linguine according to package instructions. Drain and set aside.',
      'Peel and devein the Shrimp if not already done. Mince the Garlic.',
      'In a large skillet, melt 1 tablespoon of Butter over medium heat. Add the Shrimp and cook for 1-2 minutes per side until pink. Remove the shrimp and set aside.',
      'In the same skillet, melt the remaining Butter. Add the minced Garlic and sauté for 1 minute until fragrant.',
      'Squeeze the juice of the Lemon into the skillet (you can also add a splash of white wine here if desired) and simmer for 2 minutes to reduce slightly.',
      'Return the shrimp to the skillet, add the cooked linguine, and toss everything together until well coated and heated through.'
    ],
    tags: ['seafood', 'pasta', 'italian', 'quick', 'pescatarian']
  },
  {
    id: '28', name: 'Beef and Broccoli', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800&h=800', time: '25 min', timeMinutes: 25, difficulty: 'Intermediate', cuisine: 'Asian', reason: 'Better than takeout', details: 'Tender slices of beef and crisp broccoli in a savory soy-ginger sauce.',
    ingredients: [
      { name: 'Flank Steak', amount: '300g' },
      { name: 'Broccoli', amount: '1 head' },
      { name: 'Soy Sauce', amount: '1/4 cup' },
      { name: 'Brown Sugar', amount: '2 tbsp' },
      { name: 'Garlic', amount: '2 cloves' }
    ],
    steps: [
      'Slice the Flank Steak thinly against the grain. Cut the Broccoli into small florets. Mince the Garlic.',
      'In a small bowl, whisk together the Soy Sauce, Brown Sugar, minced Garlic, and a splash of water to make the sauce.',
      'Heat a large wok or skillet over high heat with a little oil. Add the beef slices in a single layer and sear for 1-2 minutes per side until browned. Remove and set aside.',
      'In the same wok, add the broccoli florets and a splash of water. Cover and steam for 3-4 minutes until crisp-tender.',
      'Return the beef to the wok and pour the sauce over everything.',
      'Toss well and cook for another 2 minutes until the sauce thickens and coats the beef and broccoli. Serve hot over rice.'
    ],
    tags: ['beef', 'asian', 'quick', 'high-protein']
  },
  {
    id: '29', name: 'Caprese Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800&h=800', time: '10 min', timeMinutes: 10, difficulty: 'Beginner', cuisine: 'Italian', reason: 'No-cook lunch', details: 'Fresh mozzarella, ripe tomatoes, and basil on crusty bread with balsamic glaze.',
    ingredients: [
      { name: 'Ciabatta Bread', amount: '1 loaf' },
      { name: 'Fresh Mozzarella', amount: '1 ball' },
      { name: 'Tomato', amount: '1 large' },
      { name: 'Fresh Basil', amount: '1 handful' },
      { name: 'Balsamic Glaze', amount: '2 tbsp' }
    ],
    steps: [
      'Slice the Ciabatta Bread horizontally to create a top and bottom half. Lightly toast the bread if desired.',
      'Slice the Fresh Mozzarella and the Tomato into thick, even rounds.',
      'Layer the mozzarella and tomato slices alternately on the bottom half of the bread.',
      'Tuck the Fresh Basil leaves between the slices of cheese and tomato.',
      'Drizzle the Balsamic Glaze generously over the layers.',
      'Place the top half of the bread on the sandwich, press down gently, and cut in half to serve.'
    ],
    tags: ['vegetarian', 'italian', 'quick', 'lunch', 'no-cook']
  }
];
