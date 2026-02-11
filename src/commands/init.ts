import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import prompts from 'prompts';
import chalk from 'chalk';
import { loadConfig, writeConfig, getDefaultConfig, type ApexConfig } from '../utils/config.js';
import { detectProject } from '../utils/project-detector.js';
import { installDependencies } from '../utils/installer.js';
import { logger } from '../utils/logger.js';

const CSS_VARIABLES = `
/* APEX Design System - CSS Variables */
:root {
  /* Backgrounds */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  --color-bg-inverse: #0f172a;

  /* Foregrounds */
  --color-fg-primary: #0f172a;
  --color-fg-secondary: #475569;
  --color-fg-muted: #64748b;
  --color-fg-inverse: #ffffff;
  --color-fg-disabled: #94a3b8;

  /* Borders */
  --color-border-default: #e2e8f0;
  --color-border-strong: #cbd5e1;
  --color-border-focus: #3b82f6;
  --color-border-error: #ef4444;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.dark {
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-tertiary: #334155;
  --color-bg-inverse: #f8fafc;

  --color-fg-primary: #f8fafc;
  --color-fg-secondary: #cbd5e1;
  --color-fg-muted: #94a3b8;
  --color-fg-inverse: #0f172a;
  --color-fg-disabled: #475569;

  --color-border-default: #334155;
  --color-border-strong: #475569;
  --color-border-focus: #60a5fa;
  --color-border-error: #f87171;

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.4);
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;

const UTILS_FILE = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

interface InitOptions {
  yes?: boolean;
}

export async function init(options: InitOptions): Promise<void> {
  console.log('');
  console.log(chalk.bold.cyan('  APEX Design System'));
  console.log(chalk.gray('  Initialize your project'));
  console.log('');

  const cwd = process.cwd();

  // Check for existing config
  const existingConfig = await loadConfig(cwd);
  if (existingConfig && !options.yes) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'apex.config.json already exists. Overwrite?',
      initial: false,
    });
    if (!overwrite) {
      logger.info('Cancelled.');
      return;
    }
  }

  // Detect project
  const spinner = ora('Detecting project...').start();
  const projectInfo = await detectProject(cwd);
  spinner.succeed(`Detected: ${projectInfo.type} (${projectInfo.typescript ? 'TypeScript' : 'JavaScript'}) with ${projectInfo.packageManager}`);

  // Prompt for configuration
  let config: ApexConfig;

  if (options.yes) {
    config = getDefaultConfig({
      project: {
        type: projectInfo.type,
        typescript: projectInfo.typescript,
        packageManager: projectInfo.packageManager,
      },
    });
  } else {
    const answers = await prompts([
      {
        type: 'text',
        name: 'componentsPath',
        message: 'Where should components be installed?',
        initial: './src/components/ui',
      },
      {
        type: 'text',
        name: 'libPath',
        message: 'Where should utilities go?',
        initial: './src/lib',
      },
      {
        type: 'text',
        name: 'hooksPath',
        message: 'Where should hooks be installed?',
        initial: './src/hooks',
      },
      {
        type: 'confirm',
        name: 'useAliases',
        message: 'Use path aliases (@/)?',
        initial: projectInfo.typescript,
      },
      {
        type: 'text',
        name: 'tailwindConfig',
        message: 'Path to tailwind config?',
        initial: './tailwind.config.js',
      },
      {
        type: 'text',
        name: 'cssFile',
        message: 'Path to global CSS file?',
        initial: './src/index.css',
      },
    ]);

    config = getDefaultConfig({
      project: {
        type: projectInfo.type,
        typescript: projectInfo.typescript,
        packageManager: projectInfo.packageManager,
      },
      paths: {
        components: answers.componentsPath,
        lib: answers.libPath,
        hooks: answers.hooksPath,
      },
      aliases: {
        enabled: answers.useAliases,
        components: answers.useAliases ? '@/components/ui' : answers.componentsPath,
        lib: answers.useAliases ? '@/lib' : answers.libPath,
        hooks: answers.useAliases ? '@/hooks' : answers.hooksPath,
      },
      tailwind: {
        config: answers.tailwindConfig,
        css: answers.cssFile,
      },
    });
  }

  // Step 1: Write config
  const setupSpinner = ora('Setting up project...').start();

  setupSpinner.text = 'Writing apex.config.json...';
  await writeConfig(config, cwd);

  // Step 2: Create directories
  setupSpinner.text = 'Creating directories...';
  await fs.ensureDir(path.resolve(cwd, config.paths.components));
  await fs.ensureDir(path.resolve(cwd, config.paths.lib));
  await fs.ensureDir(path.resolve(cwd, config.paths.hooks));

  // Step 3: Write utils.ts
  setupSpinner.text = 'Creating utility files...';
  const utilsPath = path.resolve(cwd, config.paths.lib, 'utils.ts');
  if (!await fs.pathExists(utilsPath)) {
    await fs.writeFile(utilsPath, UTILS_FILE);
  }

  // Step 4: Update CSS file with variables
  setupSpinner.text = 'Adding design tokens to CSS...';
  const cssPath = path.resolve(cwd, config.tailwind.css);
  if (await fs.pathExists(cssPath)) {
    const existingCss = await fs.readFile(cssPath, 'utf-8');
    if (!existingCss.includes('--color-bg-primary')) {
      await fs.appendFile(cssPath, '\n' + CSS_VARIABLES);
    }
  } else {
    await fs.writeFile(cssPath, CSS_VARIABLES);
  }

  // Step 5: Update tsconfig if aliases enabled
  if (config.aliases.enabled) {
    setupSpinner.text = 'Configuring path aliases...';
    await updateTsConfig(cwd);
  }

  setupSpinner.succeed('Project configured');

  // Step 6: Install base dependencies
  const depsSpinner = ora('Installing base dependencies...').start();
  try {
    await installDependencies(
      ['clsx', 'tailwind-merge', 'class-variance-authority'],
      config.project.packageManager,
      cwd
    );
    depsSpinner.succeed('Base dependencies installed');
  } catch {
    depsSpinner.warn('Could not install dependencies automatically. Install manually:');
    logger.info(`  ${config.project.packageManager} install clsx tailwind-merge class-variance-authority`);
  }

  // Done!
  console.log('');
  console.log(chalk.bold.green('  ✅ APEX Design System initialized!'));
  console.log('');
  console.log(chalk.gray('  Next steps:'));
  console.log(chalk.cyan('    npx apex-design-cli list') + chalk.gray('      Browse available components'));
  console.log(chalk.cyan('    npx apex-design-cli add button') + chalk.gray('Install your first component'));
  console.log('');
}

async function updateTsConfig(cwd: string): Promise<void> {
  const tsconfigPath = path.join(cwd, 'tsconfig.json');

  if (!await fs.pathExists(tsconfigPath)) return;

  try {
    const tsconfig = await fs.readJson(tsconfigPath);

    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }

    if (!tsconfig.compilerOptions.baseUrl) {
      tsconfig.compilerOptions.baseUrl = '.';
    }

    if (!tsconfig.compilerOptions.paths) {
      tsconfig.compilerOptions.paths = {};
    }

    tsconfig.compilerOptions.paths['@/*'] = ['./src/*'];

    await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
  } catch {
    // Skip if we can't parse tsconfig
  }
}
