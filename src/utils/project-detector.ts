import fs from 'fs-extra';
import path from 'path';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';
export type ProjectType = 'react' | 'next' | 'vite' | 'other';

export interface ProjectInfo {
  type: ProjectType;
  typescript: boolean;
  packageManager: PackageManager;
  rootDir: string;
}

export async function detectProject(cwd: string = process.cwd()): Promise<ProjectInfo> {
  const packageManager = await detectPackageManager(cwd);
  const typescript = await detectTypeScript(cwd);
  const type = await detectProjectType(cwd);

  return {
    type,
    typescript,
    packageManager,
    rootDir: cwd,
  };
}

async function detectPackageManager(cwd: string): Promise<PackageManager> {
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (await fs.pathExists(path.join(cwd, 'bun.lockb'))) return 'bun';
  return 'npm';
}

async function detectTypeScript(cwd: string): Promise<boolean> {
  return (
    await fs.pathExists(path.join(cwd, 'tsconfig.json')) ||
    await fs.pathExists(path.join(cwd, 'tsconfig.app.json'))
  );
}

async function detectProjectType(cwd: string): Promise<ProjectType> {
  try {
    const pkg = await fs.readJson(path.join(cwd, 'package.json'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (allDeps['next']) return 'next';
    if (allDeps['vite']) return 'vite';
    if (allDeps['react']) return 'react';
  } catch {
    // no package.json
  }

  return 'other';
}
