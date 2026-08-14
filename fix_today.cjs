const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

code = code.replace(
  'className="mx-6 mt-3 p-[14px] rounded-2xl bg-stone-900 flex flex-col gap-3"',
  'className={`${CARD} mx-6 mt-3 p-[14px] flex flex-col gap-3`}'
);

fs.writeFileSync('src/views/HomeView.tsx', code);
