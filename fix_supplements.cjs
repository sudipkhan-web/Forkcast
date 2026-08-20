const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const searchTarget = `                  <div className="mt-8 mb-4">
                    <h2 className="text-xs text-[#FC5200] uppercase tracking-widest font-bold">Training & Fueling</h2>`;

const idx = code.indexOf(searchTarget);
if (idx !== -1) {
  // we want to go back to the closing </div> of the gap-4 div.
  // Actually, we can just look back from idx to find "</div>".
  const prevDivIdx = code.lastIndexOf('</div>', idx);
  console.log("Found prevDivIdx:", prevDivIdx);
} else {
  console.log("Could not find Training & Fueling");
}

