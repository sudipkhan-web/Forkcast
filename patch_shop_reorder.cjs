const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

const useEffectBlock = `  const { showToast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const name = newShoppingItemName.trim();
    if (!name) {
      setSuggestions([]);
      return;
    }
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const norm = name.toLowerCase();
      const rules = Object.keys(customIngredientRules || {});
      const matches = rules.filter(r => r.includes(norm)).slice(0, 5);
      setSuggestions(matches);
    }, 250);
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [newShoppingItemName, customIngredientRules]);`;

const destructureBlock = `  const {
    newShoppingItemName,
    setNewShoppingItemName,
    deferredItems,
    shoppingEndDate,
    setShoppingEndDate,
    combinedShoppingList,
    handleAddShoppingItem,
    updateShoppingItemQuantity,
    toggleShoppingItem,
    toggleDefer,
    handleSmartDefer,
    removeShoppingItem
  } = shoppingListProps;`;

// Remove the destructure block first
code = code.replace(destructureBlock, '');
// And insert it right after debounceRef = useRef
code = code.replace(
  "  const debounceRef = useRef<NodeJS.Timeout>();",
  "  const debounceRef = useRef<NodeJS.Timeout>();\n\n" + destructureBlock
);

fs.writeFileSync('src/views/ShopView.tsx', code);
