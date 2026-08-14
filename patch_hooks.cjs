const fs = require('fs');

function insertHook(file, functionSignature) {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes("const { showToast } = useToast();")) {
    code = code.replace(functionSignature, functionSignature + "\n  const { showToast } = useToast();");
    fs.writeFileSync(file, code);
  }
}

insertHook('src/App.tsx', "function MainApp() {");
insertHook('src/context/AppContext.tsx', "export const AppProvider = ({ children }: { children: ReactNode }) => {");
insertHook('src/views/FavoritesView.tsx', "export function FavoritesView({\n  favorites,\n  handleToggleFavorite\n}: FavoritesViewProps) {");

