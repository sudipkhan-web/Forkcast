const fs = require('fs');

let code = fs.readFileSync('src/views/FavoritesView.tsx', 'utf8');
if (!code.includes("const { showToast } = useToast();")) {
  code = code.replace("}: FavoritesViewProps) {", "}: FavoritesViewProps) {\n  const { showToast } = useToast();");
  fs.writeFileSync('src/views/FavoritesView.tsx', code);
}

let code2 = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
if (!code2.includes("const { showToast } = useToast();")) {
  code2 = code2.replace("export const AppProvider = ({ children }: { children: ReactNode }) => {", "export const AppProvider = ({ children }: { children: ReactNode }) => {\n  const { showToast } = useToast();");
  fs.writeFileSync('src/context/AppContext.tsx', code2);
}

