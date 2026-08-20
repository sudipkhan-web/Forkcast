const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// Update imports
code = code.replace(
  "import { Meal } from '../data/recipes';",
  "import { Meal, ALL_MEALS } from '../data/recipes';"
);

if (!code.includes("import { getOrGenerateRecipeImage }")) {
  code = code.replace(
    "import { initNotifications } from '../services/notificationService';",
    "import { initNotifications } from '../services/notificationService';\nimport { getOrGenerateRecipeImage } from '../services/imageGenerator';"
  );
}

// Update the inline pre-populate handler
const oldInline = `              <button
                onClick={async () => {
                  try {
                    const { doc, setDoc } = await import('firebase/firestore');
                    const { db } = await import('../firebase');
                    const { ALL_MEALS } = await import('../data/recipes');
                    const { getOrGenerateRecipeImage } = await import('../services/imageGenerator');
                    
                    alert('Starting database pre-population. This will take a moment.');
                    for (const meal of ALL_MEALS) {`;

const newInline = `              <button
                onClick={async () => {
                  try {
                    alert('Starting database pre-population. This will take a moment.');
                    for (const meal of ALL_MEALS) {`;

code = code.replace(oldInline, newInline);

fs.writeFileSync('src/views/ProfileView.tsx', code);
