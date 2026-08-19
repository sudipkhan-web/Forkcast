const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

// Replace the current polyfill with a better one.
const oldPoly = /\/\/ Polyfill wrapper to prevent[\s\S]*?if \(typeof window !== 'undefined'\) \{[\s\S]*?\}\n/g;

const newPoly = `
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  try {
    Object.defineProperty(window, 'fetch', {
      value: originalFetch,
      writable: true,
      configurable: true
    });
  } catch (e) {
    console.warn("Could not redefine window.fetch", e);
  }
}
`;

if (code.match(oldPoly)) {
  code = code.replace(oldPoly, newPoly);
} else {
  code = newPoly + "\n" + code;
}

fs.writeFileSync('src/main.tsx', code);
