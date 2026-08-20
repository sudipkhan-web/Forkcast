const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// Update Interface
code = code.replace(
  "  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;\n}",
  "  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;\n  customIngredientRules?: Record<string, any>;\n}"
);
code = code.replace(
  "  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;\r\n}",
  "  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;\r\n  customIngredientRules?: Record<string, any>;\r\n}"
);

// Update destructuring
code = code.replace(
  "  handleSelectGroup,\n  profile,\n  setProfile\n}: ProfileViewProps) {",
  "  handleSelectGroup,\n  profile,\n  setProfile,\n  customIngredientRules\n}: ProfileViewProps) {"
);
code = code.replace(
  "  handleSelectGroup,\r\n  profile,\r\n  setProfile\r\n}: ProfileViewProps) {",
  "  handleSelectGroup,\r\n  profile,\r\n  setProfile,\r\n  customIngredientRules\r\n}: ProfileViewProps) {"
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
