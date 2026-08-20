const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// 1. Remove literal \n around Supplements
if (code.includes('</div>\\n')) {
  code = code.replace('</div>\\n', '</div>');
  console.log("Removed literal \\n");
} else {
  console.log("Could not find literal \\n");
}

// 2. Extract Supplements block
const supplementsStart = `                        {/* Supplements */}`;
const fuelingStart = `              <div className={\`\${CARD} overflow-hidden\`}>
                <button
                  onClick={() => {
                    const newSet = new Set(expandedCards);
                    if (newSet.has('fueling')) newSet.delete('fueling');`;

const startIdx = code.indexOf(supplementsStart);
const endIdx = code.indexOf(fuelingStart);

if (startIdx !== -1 && endIdx !== -1) {
  let supplementsBlock = code.slice(startIdx, endIdx);
  // remove it from current location
  code = code.slice(0, startIdx) + code.slice(endIdx);
  
  // 3. Find end of Medical & Health Conditions
  const medicalEndStr = `                )}
              </AnimatePresence>
            </div>
                  </div>
                  <div className="mt-8 mb-4">
                    <h2 className="text-xs text-[#FC5200] uppercase tracking-widest font-bold">Training & Fueling</h2>`;
  
  if (code.includes(medicalEndStr)) {
    const insertStr = `                )}
              </AnimatePresence>
            </div>
` + supplementsBlock + `                  </div>
                  <div className="mt-8 mb-4">
                    <h2 className="text-xs text-[#FC5200] uppercase tracking-widest font-bold">Training & Fueling</h2>`;
    code = code.replace(medicalEndStr, insertStr);
    console.log("Moved Supplements block successfully.");
  } else {
    console.log("Could not find insertion point.");
  }
} else {
  console.log("Could not extract Supplements block.");
}

fs.writeFileSync('src/views/ProfileView.tsx', code);
