const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const moveItemsToPantry = async \(itemsToMove: ShoppingItem\[\]\) => \{[\s\S]*?\/\/ Update other states[\s\S]*?setPantryLogs\(prev => \[\.\.\.newLogs, \.\.\.prev\]\);/;

const newBlock = `const moveItemsToPantry = async (itemsToMove: ShoppingItem[]) => {
    if (!userId) return;

    const resolvedRules: Record<string, { location: 'fridge' | 'pantry', category: string }> = {};
    for (const item of itemsToMove) {
      const normalizedName = item.name.toLowerCase();
      // If we already know the rule, use it
      if (customIngredientRules[normalizedName]) {
        resolvedRules[normalizedName] = customIngredientRules[normalizedName] as { location: 'fridge' | 'pantry', category: string };
      } else {
        // Classify via API before falling back
        try {
          const res = await fetch("/api/inventory/classify-ingredient", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: item.name })
          });
          if (res.ok) {
            const data = await res.json();
            const location = data.location || 'pantry';
            const category = data.category || 'Other';
            resolvedRules[normalizedName] = { location, category };
            updateCustomIngredientRule(normalizedName, location, category);
          } else {
            resolvedRules[normalizedName] = { location: 'pantry', category: 'Other' };
          }
        } catch (err) {
          console.error("Error classifying ingredient", err);
          resolvedRules[normalizedName] = { location: 'pantry', category: 'Other' };
        }
      }
    }

    const now = new Date().toISOString();
    const newLogs: PantryLog[] = [];
    const itemsToInventory: InventoryItem[] = [];

    // We do all calculations locally first to avoid stale state issues and ensure we have the data for Firestore writes
    setInventory(prev => {
      const next = [...prev];
      itemsToMove.forEach(item => {
        const existingIndex = next.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase());
        if (existingIndex >= 0) {
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + item.quantity
          };
          itemsToInventory.push(next[existingIndex]);
        } else {
          const normalizedName = item.name.toLowerCase();
          const rule = resolvedRules[normalizedName] || { location: 'pantry', category: 'Other' };
          const newItem: InventoryItem = {
            id: Date.now().toString() + Math.random(),
            name: item.name,
            quantity: item.quantity,
            location: rule.location as 'fridge' | 'pantry',
            category: rule.category,
            expiresAt: estimateExpirationDate(rule.category, rule.location)
          };
          next.push(newItem);
          itemsToInventory.push(newItem);
        }

        newLogs.push({
          id: Date.now().toString() + Math.random(),
          itemName: item.name,
          action: 'add',
          quantityChange: item.quantity,
          timestamp: now,
          reason: 'Purchased from shopping list',
          uid: userId
        });
      });
      return next;
    });

    // Update other states
    setShoppingList(prev => prev.filter(item => !itemsToMove.some(c => c.name.toLowerCase() === item.name.toLowerCase())));
    setPantryLogs(prev => [...newLogs, ...prev]);`;

if (regex.test(code)) {
    code = code.replace(regex, newBlock);
    fs.writeFileSync('src/App.tsx', code);
    console.log('Patched moveItemsToPantry successfully!');
} else {
    console.log('Regex did not match.');
}
