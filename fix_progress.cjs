const fs = require('fs');
let code = fs.readFileSync('src/views/ProgressView.tsx', 'utf8');

// I might have sliced out too much or missed closing tags. Let's see how it ends.
// Let's just fix it manually if it's broken at the end.
if (!code.endsWith("</motion.div>\n  );\n}\n") && !code.endsWith("</motion.div>\n  );\n}")) {
  // Try to cleanly close it
  const idx = code.lastIndexOf('</motion.div>');
  if (idx !== -1) {
    code = code.substring(0, idx) + '</motion.div>\n  );\n}\n';
  } else {
    code += '\n</motion.div>\n  );\n}\n';
  }
  fs.writeFileSync('src/views/ProgressView.tsx', code);
  console.log("Fixed ProgressView tail");
} else {
  console.log("ProgressView tail looks ok");
}

