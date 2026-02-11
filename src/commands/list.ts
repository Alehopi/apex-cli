import chalk from 'chalk';
import {
  loadRegistry,
  loadComponentRegistry,
  groupByCategory,
  type ComponentRegistryItem,
} from '../utils/registry.js';

interface ListOptions {
  json?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  inputs: 'Inputs',
  display: 'Display',
  feedback: 'Feedback',
  overlay: 'Overlay',
  navigation: 'Navigation',
  'data-display': 'Data Display',
  utility: 'Utility',
  lib: 'Utilities',
  hooks: 'Hooks',
};

const CATEGORY_ORDER = [
  'inputs',
  'display',
  'feedback',
  'overlay',
  'navigation',
  'data-display',
  'utility',
  'lib',
  'hooks',
];

export async function list(options: ListOptions): Promise<void> {
  const registry = await loadRegistry();

  // Load all component details
  const components: ComponentRegistryItem[] = [];
  for (const name of registry.components) {
    const component = await loadComponentRegistry(name);
    if (component) {
      components.push(component);
    }
  }

  if (options.json) {
    console.log(JSON.stringify(components, null, 2));
    return;
  }

  // Group by category
  const byCategory = groupByCategory(components);

  console.log('');
  console.log(chalk.bold.cyan('  APEX Design System') + chalk.gray(` v${registry.version}`));
  console.log(chalk.gray(`  ${components.length} components available`));
  console.log('');

  for (const category of CATEGORY_ORDER) {
    const items = byCategory[category];
    if (!items || items.length === 0) continue;

    const label = CATEGORY_LABELS[category] || category;
    console.log(chalk.bold.yellow(`  ${label.toUpperCase()}`));
    console.log(chalk.gray('  ' + '─'.repeat(48)));

    for (const item of items) {
      const badges: string[] = [];
      if (item.dependencies.some(d => d.startsWith('@radix-ui'))) {
        badges.push(chalk.blue('Radix'));
      }
      if (item.dependencies.some(d => d.startsWith('class-variance-authority'))) {
        badges.push(chalk.magenta('CVA'));
      }

      const badgeStr = badges.length > 0 ? ' ' + badges.join(' ') : '';
      console.log(`    ${chalk.cyan(item.name.padEnd(20))}${badgeStr}`);
      console.log(`    ${chalk.gray(item.description)}`);
    }
    console.log('');
  }

  console.log(chalk.gray('  Usage:'));
  console.log(chalk.cyan('    npx apex-design-cli add <component-name>'));
  console.log(chalk.cyan('    npx apex-design-cli add button input card'));
  console.log('');
}
