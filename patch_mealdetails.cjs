const fs = require('fs');
let content = fs.readFileSync('src/views/MealDetailsView.tsx', 'utf-8');

const oldSection1 = `{selectedMeal.fuelingNote && (
          <div className="mt-6">
            <h2 className="text-xs font-display font-bold text-[#FC5200] uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> Fueling Guidance
            </h2>
            <div className="mt-3 bg-stone-900 border-l-2 border-[#FC5200] p-4 rounded-r-2xl text-stone-300 text-sm leading-relaxed">
              {selectedMeal.fuelingNote}
            </div>
          </div>
        )}`;

const newSection1 = `{selectedMeal.calories != null && selectedMeal.carbsGrams != null && selectedMeal.proteinGrams != null && selectedMeal.fatGrams != null && (
          <div className="mt-6">
            <h2 className="text-xs font-display font-bold text-stone-400 uppercase tracking-widest">Fuel Info</h2>
            <div className="mt-3 bg-stone-900 p-5 rounded-2xl border border-stone-800">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="flex flex-col">
                  <span className="text-lg font-mono font-bold text-white">{selectedMeal.calories}</span>
                  <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider mt-1">Cal</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-mono font-bold text-white">{selectedMeal.carbsGrams}g</span>
                  <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider mt-1">Carbs</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-mono font-bold text-white">{selectedMeal.proteinGrams}g</span>
                  <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider mt-1">Protein</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-mono font-bold text-white">{selectedMeal.fatGrams}g</span>
                  <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider mt-1">Fat</span>
                </div>
              </div>
              {selectedMeal.fuelingNote && (
                <p className="mt-4 text-stone-400 text-sm italic">
                  {selectedMeal.fuelingNote}
                </p>
              )}
            </div>
          </div>
        )}`;

content = content.replace(oldSection1, newSection1);

const oldSection2 = `<div className="mt-4 bg-emerald-50 p-5 rounded-2xl border border-emerald-100 space-y-3">
              {substitutions.map((sub, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 text-[#FC5200] flex items-center justify-center shrink-0 mt-0.5">
                    <RefreshCw className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-[15px] text-white">
                      Use <span className="font-bold">{sub.substitute}</span> instead of <span className="line-through text-stone-500">{sub.original}</span>
                    </p>`;

const newSection2 = `<div className="mt-4 bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3">
              {substitutions.map((sub, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 text-[#FC5200] flex items-center justify-center shrink-0 mt-0.5">
                    <RefreshCw className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-[15px] text-stone-200">
                      Use <span className="font-bold text-white">{sub.substitute}</span> instead of <span className="line-through text-stone-500">{sub.original}</span>
                    </p>`;

content = content.replace(oldSection2, newSection2);

fs.writeFileSync('src/views/MealDetailsView.tsx', content);
