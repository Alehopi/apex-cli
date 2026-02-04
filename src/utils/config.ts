import fs from 'fs-extra';
import path from 'path';
import { z } from 'zod';

const CONFIG_FILE = 'apex.config.json';

export const ConfigSchema = z.object({
  $schema: z.string().optional(),
  version: z.string(),
  project: z.object({
    type: z.enum(['react', 'next', 'vite', 'other']),
    typescript: z.boolean(),
    packageManager: z.enum(['npm', 'yarn', 'pnpm', 'bun']),
  }),
  paths: z.object({
    components: z.string(),
    lib: z.string(),
    hooks: z.string(),
  }),
  aliases: z.object({
    enabled: z.boolean(),
    components: z.string(),
    lib: z.string(),
    hooks: z.string(),
  }),
  tailwind: z.object({
    config: z.string(),
    css: z.string(),
  }),
});

export type ApexConfig = z.infer<typeof ConfigSchema>;

export async function loadConfig(cwd: string = process.cwd()): Promise<ApexConfig | null> {
  const configPath = path.join(cwd, CONFIG_FILE);

  if (!await fs.pathExists(configPath)) {
    return null;
  }

  try {
    const raw = await fs.readJson(configPath);
    return ConfigSchema.parse(raw);
  } catch {
    return null;
  }
}

export async function writeConfig(config: ApexConfig, cwd: string = process.cwd()): Promise<void> {
  const configPath = path.join(cwd, CONFIG_FILE);
  await fs.writeJson(configPath, config, { spaces: 2 });
}

export function getDefaultConfig(overrides: Partial<ApexConfig> = {}): ApexConfig {
  return {
    $schema: 'https://apex-design-system.vercel.app/schema/config.json',
    version: '1.0.0',
    project: {
      type: 'react',
      typescript: true,
      packageManager: 'npm',
      ...overrides.project,
    },
    paths: {
      components: './src/components/ui',
      lib: './src/lib',
      hooks: './src/hooks',
      ...overrides.paths,
    },
    aliases: {
      enabled: true,
      components: '@/components/ui',
      lib: '@/lib',
      hooks: '@/hooks',
      ...overrides.aliases,
    },
    tailwind: {
      config: './tailwind.config.js',
      css: './src/index.css',
      ...overrides.tailwind,
    },
  };
}
