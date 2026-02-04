import { execa } from 'execa';
import type { PackageManager } from './project-detector.js';

export async function installDependencies(
  deps: string[],
  packageManager: PackageManager,
  cwd: string = process.cwd()
): Promise<void> {
  if (deps.length === 0) return;

  const installCmd = getInstallCommand(packageManager);
  const args = [...installCmd.args, ...deps];

  await execa(installCmd.command, args, {
    cwd,
    stdio: 'pipe',
  });
}

function getInstallCommand(pm: PackageManager): { command: string; args: string[] } {
  switch (pm) {
    case 'pnpm':
      return { command: 'pnpm', args: ['add'] };
    case 'yarn':
      return { command: 'yarn', args: ['add'] };
    case 'bun':
      return { command: 'bun', args: ['add'] };
    case 'npm':
    default:
      return { command: 'npm', args: ['install'] };
  }
}

export function parseDependency(dep: string): { name: string; version: string } {
  const atIdx = dep.lastIndexOf('@');
  if (atIdx > 0) {
    return {
      name: dep.substring(0, atIdx),
      version: dep.substring(atIdx + 1),
    };
  }
  return { name: dep, version: 'latest' };
}

export async function getInstalledDeps(cwd: string = process.cwd()): Promise<Record<string, string>> {
  try {
    const pkg = await import(`${cwd}/package.json`, { with: { type: 'json' } }).catch(() => null);
    if (pkg?.default) {
      return { ...pkg.default.dependencies, ...pkg.default.devDependencies };
    }
  } catch {
    // ignore
  }
  return {};
}
