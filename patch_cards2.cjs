const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// Replace isTrainingExpanded state with expandedCards
code = code.replace(
    /const \[isTrainingExpanded, setIsTrainingExpanded\] = useState\(false\);/,
    `const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());`
);

// We should also implement `handleExpandAll` and `handleCollapseAll` inside `editingPersonId && (`
code = code.replace(
    /React\.useEffect\(\(\) => \{\n    const person = household.find\(p => p.id === editingPersonId\);\n    if \(person && person.raceType && person.raceType !== 'Not training for a race'\) \{\n      setIsTrainingExpanded\(true\);\n    \} else \{\n      setIsTrainingExpanded\(false\);\n    \}\n  \}, \[editingPersonId, household\]\);/,
    `React.useEffect(() => {
    const person = household.find(p => p.id === editingPersonId);
    if (person && person.raceType && person.raceType !== 'Not training for a race') {
      setExpandedCards(new Set(['race', 'finetune', 'supplements']));
    } else {
      setExpandedCards(new Set());
    }
  }, [editingPersonId, household]);`
);

// Replace the `isTrainingExpanded` usage entirely.
code = code.replace(
    /const \[activeTab, setActiveTab\] = React.useState<'team' | 'preferences'>\('team'\);\n  const \[isTrainingExpanded, setIsTrainingExpanded\] = React.useState\(false\);/,
    `const [activeTab, setActiveTab] = React.useState<'team' | 'preferences'>('team');`
);

code = code.replace(
    /const \[newDietary, setNewDietary\] = useState\(''\);\n  const \[expandedCards, setExpandedCards\] = useState<Set<string>>\(new Set\(\)\);/,
    `const [newDietary, setNewDietary] = useState('');\n  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());`
);


// Find the start of editingMember block to inject Expand All/Collapse All
const editingHeader = `<div className="sticky top-0 z-10 bg-[#17181C]/95 backdrop-blur-xl border-b border-stone-800 px-6 py-4 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-display font-bold text-white">
                  Editing Member
                </h2>
                <button onClick={() => setEditingPersonId(null)} className={\`\${PRIMARY_BUTTON} px-4 py-2 text-sm\`}>
                  Close
                </button>
              </div>`;

const expandCollapseButtons = `              <div className="sticky top-[73px] z-10 bg-[#17181C]/95 backdrop-blur-xl border-b border-stone-800 px-6 py-2 flex items-center gap-4 shrink-0">
                <button onClick={() => setExpandedCards(new Set(['skill', 'time', 'cuisines', 'dietary', 'disliked', 'medical', 'race', 'finetune', 'supplements']))} className="text-xs font-bold text-stone-400 hover:text-white uppercase tracking-wider">Expand All</button>
                <button onClick={() => setExpandedCards(new Set())} className="text-xs font-bold text-stone-400 hover:text-white uppercase tracking-wider">Collapse All</button>
              </div>`;

code = code.replace(editingHeader, editingHeader + '\n' + expandCollapseButtons);


// Next, let's write a function to transform each card.
// We'll replace each section `<section className={\`\${CARD} p-6\`}> ... </section>` with the Accordion Card.
// Wait, the "Training & Fueling" had a group-level accordion that we need to remove.
// The old group had: `<button onClick={() => setIsTrainingExpanded(!isTrainingExpanded)} ... >`

const groupHeaderStart = `<div className="mt-8 mb-4 flex items-center justify-between">
                    <button 
                      onClick={() => setIsTrainingExpanded(!isTrainingExpanded)}
                      className="flex items-center gap-2 text-xs text-[#FC5200] uppercase tracking-widest font-bold focus:outline-none"
                    >
                      <span>Training & Fueling</span>
                      {isTrainingExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {isTrainingExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-4 overflow-hidden"
                      >`;

const replacementGroupHeader = `<div className="mt-8 mb-4">
                    <h2 className="text-xs text-[#FC5200] uppercase tracking-widest font-bold">Training & Fueling</h2>
                  </div>
                  <div className="flex flex-col gap-4">`;

code = code.replace(groupHeaderStart, replacementGroupHeader);
code = code.replace(/<\/motion\.div>\n                    \)\}\n                  <\/AnimatePresence>/, '</div>');

fs.writeFileSync('src/views/ProfileView.tsx', code);
console.log("Replaced training group header");
