const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const script = `
    <script>
      // Polyfill wrapper to prevent "Cannot set property fetch of #<Window> which has only a getter"
      if (typeof window !== 'undefined') {
        const originalFetch = window.fetch;
        try {
          Object.defineProperty(window, 'fetch', {
            get: function() { return originalFetch; },
            set: function(val) { 
              // Ignore attempts to overwrite window.fetch
            },
            configurable: true
          });
        } catch (e) {
          // Ignore
        }
      }
    </script>
  </head>`;

code = code.replace("  </head>", script);
fs.writeFileSync('index.html', code);
