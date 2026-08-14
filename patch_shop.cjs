const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

if (!code.includes("import { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER }")) {
  code = code.replace(
    "import { NotificationBell } from '../components/NotificationBell';",
    "import { NotificationBell } from '../components/NotificationBell';\nimport { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER } from '../styles/designTokens';"
  );
}

const currentListClass = 'className={`bg-stone-900 border border-stone-800 rounded-2xl p-5 flex items-center justify-between shadow-sm transition-opacity ${item.checked ? \'opacity-60\' : \'\'}`}';
const newCurrentListClass = 'className={`\\${CARD} p-5 flex items-center justify-between transition-opacity ${item.checked ? \'opacity-60\' : \'\'}`}';
code = code.replace(currentListClass, newCurrentListClass);

const buyLaterClass = 'className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex items-center justify-between shadow-sm"';
const newBuyLaterClass = 'className={`\\${CARD} p-5 flex items-center justify-between`}';
code = code.replace(buyLaterClass, newBuyLaterClass);

const stepperClass = 'className={`flex items-center bg-stone-900 rounded-lg border border-stone-800 p-1 ${item.isGenerated ? \'opacity-50 pointer-events-none\' : \'\'}`}';
const newStepperClass = 'className={`\\${STEPPER} ${item.isGenerated ? \'opacity-50 pointer-events-none\' : \'\'}`}';
code = code.replace(stepperClass, newStepperClass);

const deferButtonClass = 'className="p-2 text-stone-400 hover:text-[#FC5200] hover:bg-emerald-500/10 rounded-lg transition-all active:scale-[0.98]"\n                        title="Buy Later"';
const newDeferButtonClass = 'className={ICON_BUTTON}\n                        title="Buy Later"';
code = code.replace(deferButtonClass, newDeferButtonClass);

const trashButtonClass = 'className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-[0.98]"';
const newTrashButtonClass = 'className={`\\${ICON_BUTTON} hover:text-red-400`}';
code = code.replace(trashButtonClass, newTrashButtonClass);

const movePantryButtonClass = 'className="pointer-events-auto w-full max-w-sm py-4 bg-[#FC5200] text-white rounded-2xl font-semibold text-lg hover:bg-[#FC5200] transition-all active:scale-[0.98] shadow-lg shadow-[#FC5200]/20 flex items-center justify-center gap-2"';
const newMovePantryButtonClass = 'className={`\\${PRIMARY_BUTTON} pointer-events-auto w-full max-w-sm py-4 flex items-center justify-center gap-2 text-lg`}';
code = code.replace(movePantryButtonClass, newMovePantryButtonClass);

const pillClass = 'className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-full px-4 py-2 text-xs font-medium text-stone-300 hover:border-stone-700 hover:text-white transition-all active:scale-[0.98]"';
const newPillClass = 'className={PILL}';
code = code.replace(pillClass, newPillClass);
code = code.replace(pillClass, newPillClass);

fs.writeFileSync('src/views/ShopView.tsx', code);
