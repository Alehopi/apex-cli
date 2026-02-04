import type { ApexConfig } from './config.js';

export function transformImports(sourceCode: string, config: ApexConfig): string {
  let transformed = sourceCode;

  if (config.aliases.enabled) {
    // Transform ../../lib/utils → @/lib/utils
    transformed = transformed.replace(
      /from\s+['"]\.\.\/\.\.\/lib\/utils['"]/g,
      `from '${config.aliases.lib}/utils'`
    );

    // Transform ../../hooks/useTheme → @/hooks/use-theme
    transformed = transformed.replace(
      /from\s+['"]\.\.\/\.\.\/hooks\/useTheme['"]/g,
      `from '${config.aliases.hooks}/use-theme'`
    );

    // Transform ../ComponentName/ComponentName → @/components/ui/component-name
    transformed = transformed.replace(
      /from\s+['"]\.\.\/(\w+)\/\1['"]/g,
      (_match, componentName) => {
        const kebab = toKebabCase(componentName);
        return `from '${config.aliases.components}/${kebab}'`;
      }
    );

    // Transform ../ComponentName → @/components/ui/component-name
    transformed = transformed.replace(
      /from\s+['"]\.\.\/(\w+)['"]/g,
      (_match, componentName) => {
        const kebab = toKebabCase(componentName);
        return `from '${config.aliases.components}/${kebab}'`;
      }
    );
  } else {
    // Use relative paths
    transformed = transformed.replace(
      /from\s+['"]\.\.\/\.\.\/lib\/utils['"]/g,
      `from '../../lib/utils'`
    );

    transformed = transformed.replace(
      /from\s+['"]\.\.\/\.\.\/hooks\/useTheme['"]/g,
      `from '../../hooks/use-theme'`
    );
  }

  return transformed;
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
