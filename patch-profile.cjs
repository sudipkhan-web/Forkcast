const fs = require('fs');
let content = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const trainingSectionEnd = `                  </select>
                </div>
              </div>
            </div>`;

const newFields = `
            {/* Biometrics */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-stone-800 pb-2">Biometrics (For Carb Targets)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-stone-300 mb-1 block">Age</label>
                    <input 
                      type="number"
                      className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                      value={profile.age || ''}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : undefined;
                        setProfile(prev => ({ ...prev, age: value }));
                        if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid), { age: value }, { merge: true });
                      }}
                      placeholder="e.g. 30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-300 mb-1 block">Biological Sex (Metabolism)</label>
                    <select 
                      className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                      value={profile.biologicalSex || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfile(prev => ({ ...prev, biologicalSex: value || undefined }));
                        if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid), { biologicalSex: value || null }, { merge: true });
                      }}
                    >
                      <option value="">Not Specified</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-300 mb-1 block">Height (cm)</label>
                    <input 
                      type="number"
                      className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                      value={profile.heightCm || ''}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : undefined;
                        setProfile(prev => ({ ...prev, heightCm: value }));
                        if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid), { heightCm: value }, { merge: true });
                      }}
                      placeholder="e.g. 175"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-300 mb-1 block">Weight (kg)</label>
                    <input 
                      type="number"
                      className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                      value={profile.weightKg || ''}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : undefined;
                        setProfile(prev => ({ ...prev, weightKg: value }));
                        if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid), { weightKg: value }, { merge: true });
                      }}
                      placeholder="e.g. 70"
                    />
                  </div>
                </div>
              </div>
            </div>`;

if (content.includes('Weekly Training Days')) {
  // Find where the Training Profile section ends.
  const regex = /<label className="text-xs font-medium text-stone-300 mb-1 block">Weekly Training Days<\/label>[\s\S]*?<\/select>\s*<\/div>\s*<\/div>\s*<\/div>/;
  const match = content.match(regex);
  if (match) {
    content = content.replace(match[0], match[0] + '\\n' + newFields);
    fs.writeFileSync('src/views/ProfileView.tsx', content);
  }
}
