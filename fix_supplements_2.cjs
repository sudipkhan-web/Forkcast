const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

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
  // Remove it from its current position
  code = code.slice(0, startIdx) + code.slice(endIdx);
  
  // Find where to insert it: before the closing </div> of "Dietary & Health" flex-col
  const targetStr = `                  </div>
                  <div className="mt-8 mb-4">
                    <h2 className="text-xs text-[#FC5200] uppercase tracking-widest font-bold">Training & Fueling</h2>`;
  
  const insertIdx = code.indexOf(targetStr);
  if (insertIdx !== -1) {
    code = code.slice(0, insertIdx) + supplementsBlock + code.slice(insertIdx);
    fs.writeFileSync('src/views/ProfileView.tsx', code);
    console.log("Success: Supplements moved.");
  } else {
    console.log("Could not find insertion target.");
  }
} else {
  console.log("Could not extract Supplements block.");
}
