#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './commands/init.js';
import { add } from './commands/add.js';
import { list } from './commands/list.js';

const program = new Command();

program
  .name('apex-design-cli')
  .description('CLI tool for APEX Design System — Install professional React components with a single command')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize your project for APEX Design System')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(init);

program
  .command('add')
  .description('Add components to your project')
  .argument('<components...>', 'Components to install')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('-p, --path <path>', 'Custom installation path')
  .action(add);

program
  .command('list')
  .description('List all available components')
  .option('-j, --json', 'Output as JSON')
  .action(list);

program.parse();
