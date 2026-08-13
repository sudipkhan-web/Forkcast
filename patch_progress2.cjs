const fs = require('fs');
let content = fs.readFileSync('src/views/ProgressView.tsx', 'utf-8');

// Replace target band
content = content.replace(
  'className="absolute w-full bg-stone-700/50 border-y border-stone-600/50 rounded-sm z-0"',
  'className="absolute w-full bg-stone-700 rounded-sm z-0"'
);

// Find the second chart and remove it
const startIndex = content.indexOf('<div className="flex items-end gap-1.5 h-48 mt-4 relative">');
if (startIndex !== -1) {
  // Let's find the closing </div> of this block by finding the legend right after it
  const legendIndex = content.indexOf('{/* Legend */}', startIndex);
  if (legendIndex !== -1) {
    // The previous div closing tag before {/* Legend */}
    const blockToRemove = content.substring(startIndex, legendIndex);
    content = content.replace(blockToRemove, '');
  }
}

fs.writeFileSync('src/views/ProgressView.tsx', content);
console.log("Patched ProgressView 2");
