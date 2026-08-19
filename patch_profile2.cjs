const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// We are going to find all the individual sections inside the `{(() => { const person = ...` block
// and replace them with the grouped structure.

// We will cut the entire block from `<section className={\`\${CARD} p-6\`}>` (the first one is Dietary Preferences)
// down to the bottom where `</>` is closed before `})()}`

const startIdx = code.indexOf('<section className={`${CARD} p-6`}>\n                    <div className="flex items-center gap-2 mb-4">\n                      <Leaf className="w-4 h-4 text-[#FC5200]" />\n                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Dietary Preferences</h2>');

if (startIdx === -1) {
    console.error("Start section not found");
    process.exit(1);
}

// Find the end of the block.
const endBlockString = '            </motion.div>\n          </>\n        ) : (\n          <div className="flex flex-col gap-6">\n';
const endIdx = code.indexOf(endBlockString);

if (endIdx === -1) {
    console.error("End section not found");
    process.exit(1);
}

const originalBlock = code.substring(startIdx, endIdx);
fs.writeFileSync('original_block.txt', originalBlock);
console.log("Extracted original block. Length:", originalBlock.length);
