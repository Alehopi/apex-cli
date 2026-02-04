import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ComponentFile {
  path: string;
  target: string;
}

export interface ComponentRegistryItem {
  name: string;
  type: 'registry:ui' | 'registry:lib' | 'registry:hook';
  title: string;
  description: string;
  category: string;
  files: ComponentFile[];
  dependencies: string[];
  registryDependencies: string[];
  exports: string[];
}

export interface Registry {
  name: string;
  version: string;
  components: string[];
}

function getPackageRoot(): string {
  // Walk up from __dirname to find package.json
  let dir = __dirname;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return __dirname;
}

function getRegistryDir(): string {
  return path.join(getPackageRoot(), 'registry');
}

export async function loadRegistry(): Promise<Registry> {
  const registryPath = path.join(getRegistryDir(), 'registry.json');
  return fs.readJson(registryPath);
}

export async function loadComponentRegistry(name: string): Promise<ComponentRegistryItem | null> {
  const componentPath = path.join(getRegistryDir(), 'components', `${name}.json`);

  if (!await fs.pathExists(componentPath)) {
    return null;
  }

  return fs.readJson(componentPath);
}

export async function resolveComponentSource(file: ComponentFile): Promise<string> {
  // file.path is relative to the package root (e.g., ../../saas-design-system/src/...)
  const packageRoot = getPackageRoot();
  const sourcePath = path.resolve(packageRoot, file.path);

  if (!await fs.pathExists(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  return fs.readFile(sourcePath, 'utf-8');
}

export async function resolveDependencyTree(
  componentNames: string[]
): Promise<ComponentRegistryItem[]> {
  const resolved = new Map<string, ComponentRegistryItem>();
  const queue = [...componentNames];

  while (queue.length > 0) {
    const name = queue.shift()!;

    if (resolved.has(name)) continue;

    const component = await loadComponentRegistry(name);
    if (!component) continue;

    resolved.set(name, component);

    for (const dep of component.registryDependencies) {
      if (!resolved.has(dep)) {
        queue.push(dep);
      }
    }
  }

  return Array.from(resolved.values());
}

export function groupByCategory(
  components: ComponentRegistryItem[]
): Record<string, ComponentRegistryItem[]> {
  return components.reduce((acc, component) => {
    const category = component.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as Record<string, ComponentRegistryItem[]>);
}
