const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const stateInsert = `  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [overflowVisibleCards, setOverflowVisibleCards] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    setOverflowVisibleCards(prev => {
      const next = new Set(prev);
      for (const id of next) {
        if (!expandedCards.has(id)) next.delete(id);
      }
      return next;
    });
  }, [expandedCards]);`;

code = code.replace(`  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());`, stateInsert);

const patchMotionDiv = (id, target) => {
  const replacement = target.replace(
    /className="overflow-hidden"/g,
    `onAnimationComplete={() => {
                      if (expandedCards.has('${id}')) {
                        setOverflowVisibleCards(prev => new Set([...prev, '${id}']));
                      }
                    }}
                    className={overflowVisibleCards.has('${id}') ? "overflow-visible" : "overflow-hidden"}`
  );
  code = code.replace(target, replacement);
};

// We need to carefully find the exact motion.div blocks for cuisines, dietary, medical, disliked.

// dietary block
const dietaryStart = `                {expandedCards.has('dietary') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >`;
patchMotionDiv('dietary', dietaryStart);

// cuisines block
const cuisinesStart = `                {expandedCards.has('cuisines') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >`;
patchMotionDiv('cuisines', cuisinesStart);

// medical block
const medicalStart = `                {expandedCards.has('medical') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >`;
patchMotionDiv('medical', medicalStart);

// disliked block
const dislikedStart = `                {expandedCards.has('disliked') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >`;
patchMotionDiv('disliked', dislikedStart);

fs.writeFileSync('src/views/ProfileView.tsx', code);
console.log("Done patching animations");
