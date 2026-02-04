import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import prompts from 'prompts';
import chalk from 'chalk';
import { loadConfig } from '../utils/config.js';
import {
  loadRegistry,
  loadComponentRegistry,
  resolveDependencyTree,
  resolveComponentSource,
  type ComponentRegistryItem,
} from '../utils/registry.js';
import { transformImports } from '../utils/transformer.js';
import { installDependencies, parseDependency } from '../utils/installer.js';
import { logger } from '../utils/logger.js';

interface AddOptions {
  overwrite?: boolean;
  path?: string;
}

export async function add(componentNames: string[], options: AddOptions): Promise<void> {
  const cwd = process.cwd();

  // 1. Load config
  const config = await loadConfig(cwd);
  if (!config) {
    logger.error('apex.config.json not found. Run first:');
    console.log(chalk.cyan('\n  npx apex-cli init\n'));
    process.exit(1);
  }

  // 2. Load registry
  const spinner = ora('Loading registry...').start();
  const registry = await loadRegistry();

  // 3. Validate requested components
  const validNames: string[] = [];
  for (const name of componentNames) {
    const normalized = name.toLowerCase().replace(/\s+/g, '-');
    if (registry.components.includes(normalized)) {
      validNames.push(normalized);
    } else {
      spinner.stop();
      logger.warn(`Component "${name}" not found. Skipping.`);
      spinner.start();
    }
  }

  if (validNames.length === 0) {
    spinner.fail('No valid components found.');
    console.log(chalk.gray('\n  Run ') + chalk.cyan('npx apex-cli list') + chalk.gray(' to see available components.\n'));
    return;
  }

  // 4. Resolve dependency tree
  spinner.text = 'Resolving dependencies...';
  const allComponents = await resolveDependencyTree(validNames);

  // Show what will be installed
  const requested = allComponents.filter(c => validNames.includes(c.name));
  const autoInstalled = allComponents.filter(c => !validNames.includes(c.name));

  spinner.succeed('Dependencies resolved');

  if (autoInstalled.length > 0) {
    for (const dep of autoInstalled) {
      logger.info(`Auto-including ${chalk.cyan(dep.title)} (required dependency)`);
    }
  }

  // 5. Check for file conflicts
  const conflicts: string[] = [];
  for (const component of allComponents) {
    for (const file of component.files) {
      const targetDir = getTargetDir(component, config, options.path);
      const targetPath = path.resolve(cwd, targetDir, path.basename(file.target));
      if (await fs.pathExists(targetPath)) {
        conflicts.push(targetPath);
      }
    }
  }

  if (conflicts.length > 0 && !options.overwrite) {
    logger.warn(`${conflicts.length} file(s) already exist:`);
    for (const conflict of conflicts) {
      console.log(chalk.gray(`  ${path.relative(cwd, conflict)}`));
    }
    const { proceed } = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: 'Overwrite existing files?',
      initial: false,
    });
    if (!proceed) {
      logger.info('Cancelled.');
      return;
    }
  }

  // 6. Collect and install npm dependencies
  const npmDeps = new Set<string>();
  for (const component of allComponents) {
    for (const dep of component.dependencies) {
      const { name } = parseDependency(dep);
      npmDeps.add(name);
    }
  }

  if (npmDeps.size > 0) {
    const depsSpinner = ora('Installing npm dependencies...').start();
    try {
      await installDependencies(
        Array.from(npmDeps),
        config.project.packageManager,
        cwd
      );
      depsSpinner.succeed(`Installed ${npmDeps.size} dependencies`);
    } catch {
      depsSpinner.warn('Could not install dependencies automatically.');
      logger.info(`  Install manually: ${Array.from(npmDeps).join(' ')}`);
    }
  }

  // 7. Copy and transform files
  const copySpinner = ora('Copying components...').start();
  const copiedFiles: string[] = [];

  for (const component of allComponents) {
    for (const file of component.files) {
      try {
        const sourceContent = await resolveComponentSource(file);
        const transformed = transformImports(sourceContent, config);

        const targetDir = getTargetDir(component, config, options.path);
        const targetPath = path.resolve(cwd, targetDir, path.basename(file.target));

        await fs.ensureDir(path.dirname(targetPath));
        await fs.writeFile(targetPath, transformed);

        copiedFiles.push(path.relative(cwd, targetPath));
      } catch (err) {
        copySpinner.stop();
        logger.warn(`Could not copy ${file.target}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        copySpinner.start();
      }
    }
  }

  copySpinner.succeed(`Copied ${copiedFiles.length} files`);

  // 8. Success message
  console.log('');
  console.log(chalk.bold.green('  ✅ Components installed successfully!'));
  console.log('');

  console.log(chalk.gray('  Added:'));
  for (const component of requested) {
    console.log(chalk.cyan(`    ${component.title}`));
  }
  if (autoInstalled.length > 0) {
    for (const dep of autoInstalled) {
      console.log(chalk.gray(`    ${dep.title} (auto-installed)`));
    }
  }

  // 9. Show usage
  console.log('');
  console.log(chalk.gray('  Import in your app:'));
  for (const component of requested) {
    if (component.type === 'registry:ui') {
      const mainExports = component.exports.slice(0, 3).join(', ');
      const suffix = component.exports.length > 3 ? ', ...' : '';
      const importPath = config.aliases.enabled
        ? `${config.aliases.components}/${component.name}`
        : `${config.paths.components}/${component.name}`;
      logger.importExample(`import { ${mainExports}${suffix} } from '${importPath}';`);
    }
  }
  console.log('');
}

function getTargetDir(
  component: ComponentRegistryItem,
  config: { paths: { components: string; lib: string; hooks: string } },
  customPath?: string
): string {
  if (customPath) return customPath;

  switch (component.type) {
    case 'registry:lib':
      return config.paths.lib;
    case 'registry:hook':
      return config.paths.hooks;
    case 'registry:ui':
    default:
      return config.paths.components;
  }
}
