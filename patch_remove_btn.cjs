const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

const targetButton = `                      <button 
                        onClick={() => onMoveItemToPantry(item)}
                        className="p-2 text-stone-400 hover:text-[#FC5200] hover:bg-emerald-500/10 rounded-lg transition-all active:scale-[0.98]"
                        title="Purchased & move to pantry"
                      >
                        <Package className="w-5 h-5" />
                      </button>`;

if (code.includes(targetButton)) {
  code = code.replace(targetButton + '\n', '');
  fs.writeFileSync('src/views/ShopView.tsx', code);
  console.log("Button removed successfully");
} else {
  console.log("Could not find the exact button block to replace.");
}
