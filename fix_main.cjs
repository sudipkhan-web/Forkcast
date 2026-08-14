const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const patch = `
// Polyfill wrapper to prevent "Cannot set property fetch of #<Window> which has only a getter"
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  try {
    Object.defineProperty(window, 'fetch', {
      get: () => originalFetch,
      set: () => {
        // Ignore attempts to overwrite window.fetch
      },
      configurable: true
    });
  } catch (e) {
    // Ignore if not configurable
  }
}
`;

if (!code.includes("Cannot set property fetch")) {
  code = patch + '\n' + code;
  fs.writeFileSync('src/main.tsx', code);
}
