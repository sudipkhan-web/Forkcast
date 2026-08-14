const fs = require('fs');
let code = fs.readFileSync('src/views/TermsGateView.tsx', 'utf8');

code = code.replace(
  '      </div>\n      <div className="mt-8 w-full">',
  '        <div className="mt-8 w-full">'
);
code = code.replace(
  '        </button>\n      </div>\n    </div>',
  '        </button>\n      </div>\n      </div>\n    </div>'
);

fs.writeFileSync('src/views/TermsGateView.tsx', code);
