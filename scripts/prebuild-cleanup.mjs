import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const unsupportedConfig = join(process.cwd(), 'next.config.ts');

if (existsSync(unsupportedConfig)) {
  rmSync(unsupportedConfig);
  console.warn("[prebuild] Removed unsupported Next.js config file: next.config.ts");
}
