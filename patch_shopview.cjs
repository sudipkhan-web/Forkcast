const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

// Add import
const importTokenRegex = /import \{ CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER \} from '\.\.\/styles\/designTokens';/;
if (code.match(importTokenRegex)) {
  code = code.replace(importTokenRegex, "import { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER } from '../styles/designTokens';\nimport { useToast } from '../components/Toast';");
} else {
  code = "import { useToast } from '../components/Toast';\n" + code;
}

// Add hook
const shopViewDecl = "}: ShopViewProps) {";
code = code.replace(shopViewDecl, "}: ShopViewProps) {\n  const { showToast } = useToast();");

// Add catch block logic
const catchBlockOld = `    } catch (error) {
      console.error("Failed to suggest staples:", error);
    } finally {`;
const catchBlockNew = `    } catch (error) {
      console.error("Failed to suggest staples:", error);
      showToast("Couldn't load staple suggestions — check your connection and try again.", 'error');
      setIsStaplesModalOpen(false);
    } finally {`;
code = code.replace(catchBlockOld, catchBlockNew);

fs.writeFileSync('src/views/ShopView.tsx', code);
