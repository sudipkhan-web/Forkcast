const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const targetStr = "{/* Biometrics */}";

const supplementState = `  const [newSupplement, setNewSupplement] = useState('');`;
if (!code.includes(supplementState)) {
  code = code.replace(
    "const [newFavoriteCuisine, setNewFavoriteCuisine] = useState('');",
    "const [newFavoriteCuisine, setNewFavoriteCuisine] = useState('');\n  const [newSupplement, setNewSupplement] = useState('');"
  );
}

const supplementUI = `            {/* Supplements */}
            <section className="pt-6 border-t border-stone-800">
              <div className="flex items-center gap-2 mb-2"> 
                <Activity className="w-4 h-4 text-[#FC5200]" />
                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Supplements</h2>
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                Track your daily supplements.
              </p>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['Vitamin D', 'Magnesium', 'Creatine', 'Omega-3'].map(supp => (
                    <button
                      key={supp}
                      onClick={() => {
                        const current = person.trackedSupplements || [];
                        if (current.includes(supp)) {
                          updateHouseholdMember({ ...person, trackedSupplements: current.filter(s => s !== supp) });
                        } else {
                          updateHouseholdMember({ ...person, trackedSupplements: [...current, supp] });
                        }
                      }}
                      className={\`px-3 py-1.5 rounded-full text-xs font-medium transition-colors \${
                        (person.trackedSupplements || []).includes(supp)
                          ? 'bg-[#FC5200]/20 text-[#FC5200] border border-[#FC5200]/50'
                          : 'bg-stone-900 text-stone-400 border border-stone-800 hover:border-stone-700'
                      }\`}
                    >
                      {supp}
                    </button>
                  ))}
                  {(person.trackedSupplements || []).filter(s => !['Vitamin D', 'Magnesium', 'Creatine', 'Omega-3'].includes(s)).map(supp => (
                    <span
                      key={supp}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FC5200]/20 text-[#FC5200] border border-[#FC5200]/50 flex items-center gap-1"
                    >
                      {supp}
                      <button
                        onClick={() => {
                          updateHouseholdMember({
                            ...person,
                            trackedSupplements: (person.trackedSupplements || []).filter(s => s !== supp)
                          });
                        }}
                        className="text-[#FC5200] hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSupplement}
                    onChange={(e) => setNewSupplement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSupplement.trim()) {
                        e.preventDefault();
                        const val = newSupplement.trim();
                        if (!(person.trackedSupplements || []).includes(val)) {
                          updateHouseholdMember({
                            ...person,
                            trackedSupplements: [...(person.trackedSupplements || []), val]
                          });
                        }
                        setNewSupplement('');
                      }
                    }}
                    placeholder="Add other supplement..."
                    className="flex-1 bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                  />
                  <button
                    onClick={() => {
                      if (newSupplement.trim()) {
                        const val = newSupplement.trim();
                        if (!(person.trackedSupplements || []).includes(val)) {
                          updateHouseholdMember({
                            ...person,
                            trackedSupplements: [...(person.trackedSupplements || []), val]
                          });
                        }
                        setNewSupplement('');
                      }
                    }}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </section>
            
`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, supplementUI + targetStr);
  fs.writeFileSync('src/views/ProfileView.tsx', code);
  console.log("Updated ProfileView.tsx");
} else {
  console.log("targetStr not found!");
}

