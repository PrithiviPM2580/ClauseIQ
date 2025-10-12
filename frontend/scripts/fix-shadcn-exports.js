// scripts/fix-shadcn-exports.js
import fs from 'fs';
import path from 'path';

const COMPONENTS_DIR = path.resolve('src/components/ui');

fs.readdirSync(COMPONENTS_DIR).forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(COMPONENTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // If it has both a React component and another export (like variants)
    if (content.includes('export {') && content.match(/cva\(/)) {
      const baseName = path.basename(file, '.tsx');
      const variantFile = path.join(COMPONENTS_DIR, `${baseName}-variants.ts`);
      const variantMatch = content.match(/const .*?cva\(.*\}\s*\)/s);

      if (variantMatch) {
        const variantContent = `import { cva, type VariantProps } from "class-variance-authority";

${variantMatch[0]}

export type ${
          baseName.charAt(0).toUpperCase() + baseName.slice(1)
        }VariantProps = VariantProps<typeof ${variantMatch[0].match(/const (\w+)/)[1]}>;

export { ${variantMatch[0].match(/const (\w+)/)[1]} };
`;
        fs.writeFileSync(variantFile, variantContent, 'utf8');
        console.log(`✅ Created variant file: ${variantFile}`);
      }

      // Keep only component export in original file
      const newContent = content.replace(
        /export\s*\{[\s\S]*?\};/g,
        'export { Button };'
      );
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✨ Cleaned up component file: ${filePath}`);
    }
  }
});
