const fs = require('fs');
let code = fs.readFileSync('src/views/ProgressView.tsx', 'utf8');

// The error TS1005: ')' expected at 215,1 usually means a missing closing brace/parenthesis before that line.
// Let's replace the last bit. It should end with:
//         </div>
//       </div>
//     </motion.div>
//   );
// }

const idx = code.indexOf('          {/* Legend */}');
if (idx !== -1) {
  const goodPart = code.substring(0, idx);
  const correctEnd = `          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-stone-500" />
              <span className="text-[10px] text-stone-400 font-medium uppercase">Under</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#FC5200]" />
              <span className="text-[10px] text-stone-400 font-medium uppercase">Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span className="text-[10px] text-stone-400 font-medium uppercase">Over</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-stone-800 border border-stone-700" />
              <span className="text-[10px] text-stone-400 font-medium uppercase">Range</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
`;
  fs.writeFileSync('src/views/ProgressView.tsx', goodPart + correctEnd);
  console.log("Forced correct ProgressView tail");
}
