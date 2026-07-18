import { useState, useMemo } from 'react';
import { ShoppingItem, InventoryItem } from '../types';
import { auth, db } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

// Helper function to check if an item is perishable
export const isPerishable = (name: string) => {
  const PERISHABLE_KEYWORDS = ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'lettuce', 'spinach', 'tomato', 'onion', 'garlic', 'cilantro', 'parsley', 'basil', 'egg', 'apple', 'banana', 'berry', 'berries', 'lemon', 'lime', 'avocado', 'carrot', 'broccoli', 'mushroom', 'pepper', 'meat', 'tofu', 'tempeh'];
  return PERISHABLE_KEYWORDS.some(keyword => name.toLowerCase().includes(keyword));
};

export function useShoppingList(
  shoppingList: ShoppingItem[], 
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingItem[]>>,
  inventory: InventoryItem[]
) {
  const [newShoppingItemName, setNewShoppingItemName] = useState('');
  const [deferredItems, setDeferredItems] = useState<Record<string, boolean>>({});
  const [shoppingEndDate, setShoppingEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const combinedShoppingList = useMemo(() => {
    const map = new Map<string, ShoppingItem & { amounts: string[], isGenerated: boolean, neededBy?: string, isPerishable: boolean }>();
    
    // Add manual items (which now includes automatically added planned meal ingredients)
    shoppingList.forEach(item => {
      map.set(item.name.toLowerCase(), { ...item, amounts: item.amount ? [item.amount] : [], isGenerated: false, isPerishable: isPerishable(item.name) });
    });

    return Array.from(map.values());
  }, [shoppingList, inventory]);

  const inShoppingList = (name: string) => {
    return combinedShoppingList.some(item => item.name.toLowerCase() === name.toLowerCase());
  };

  const addShoppingItemDirectly = async (name: string, quantity: number = 1, isStaple: boolean = false) => {
    if (!name.trim() || !auth.currentUser) return;
    
    const cleanName = name.trim();
    let updatedItem: ShoppingItem | null = null;

    setShoppingList(prev => {
      const existingIndex = prev.findIndex(item => item.name.toLowerCase() === cleanName.toLowerCase());
      const newList = [...prev];
      if (existingIndex === -1) {
        updatedItem = { id: Date.now().toString() + Math.random().toString(36).substring(2, 6), name: cleanName, quantity, checked: false, isStaple, uid: auth.currentUser!.uid };
        newList.push(updatedItem);
      } else {
        updatedItem = { ...newList[existingIndex], quantity: newList[existingIndex].quantity + quantity, checked: false, isStaple: isStaple || newList[existingIndex].isStaple, uid: auth.currentUser!.uid };
        newList[existingIndex] = updatedItem;
      }
      return newList;
    });

    if (updatedItem) {
      await setDoc(doc(db, `users/${auth.currentUser.uid}/shoppingList`, (updatedItem as ShoppingItem).id), updatedItem, { merge: true });
    }
  };

  const handleAddShoppingItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShoppingItemName.trim()) return;
    await addShoppingItemDirectly(newShoppingItemName);
    setNewShoppingItemName('');
  };

  const updateShoppingItemQuantity = async (id: string, delta: number, isGenerated: boolean) => {
    if (isGenerated || !auth.currentUser) return;
    
    let updatedItem: ShoppingItem | null = null;
    setShoppingList(prev => {
      return prev.map(item => {
        if (item.id === id) {
          updatedItem = { ...item, quantity: Math.max(1, item.quantity + delta), uid: auth.currentUser!.uid };
          return updatedItem;
        }
        return item;
      });
    });
    
    if (updatedItem) {
      await setDoc(doc(db, `users/${auth.currentUser.uid}/shoppingList`, id), updatedItem, { merge: true });
    }
  };

  const toggleShoppingItem = async (id: string, isGenerated: boolean, name: string) => {
    if (!auth.currentUser) return;
    let updatedItem: ShoppingItem | null = null;
    setShoppingList(prev => {
      return prev.map(item => {
        if (item.id === id) {
          updatedItem = { ...item, checked: !item.checked, uid: auth.currentUser!.uid };
          return updatedItem;
        }
        return item;
      });
    });
    
    if (updatedItem) {
      await setDoc(doc(db, `users/${auth.currentUser.uid}/shoppingList`, id), updatedItem, { merge: true });
    }
  };

  const toggleDefer = (name: string) => {
    setDeferredItems(prev => ({
      ...prev,
      [name.toLowerCase()]: !prev[name.toLowerCase()]
    }));
  };

  const handleSmartDefer = () => {
    const newDeferred = { ...deferredItems };
    combinedShoppingList.forEach(item => {
      if (item.isPerishable && item.neededBy && item.neededBy > shoppingEndDate) {
        newDeferred[item.name.toLowerCase()] = true;
      }
    });
    setDeferredItems(newDeferred);
  };

  const removeShoppingItem = async (id: string, isGenerated: boolean) => {
    if (isGenerated) return;
    setShoppingList(prev => prev.filter(item => item.id !== id));
    if (auth.currentUser) {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/shoppingList`, id));
    }
  };

  return {
    newShoppingItemName,
    setNewShoppingItemName,
    deferredItems,
    setDeferredItems,
    shoppingEndDate,
    setShoppingEndDate,
    combinedShoppingList,
    inShoppingList,
    handleAddShoppingItem,
    addShoppingItemDirectly,
    updateShoppingItemQuantity,
    toggleShoppingItem,
    toggleDefer,
    handleSmartDefer,
    removeShoppingItem
  };
}
