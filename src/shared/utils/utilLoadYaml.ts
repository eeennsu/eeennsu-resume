import fs from 'fs';
import path from 'path';

import yaml from 'js-yaml';

export const loadYaml = <T>(relativePath: string): T | null => {
  try {
    const filePath = path.join(process.cwd(), relativePath);
    const file = fs.readFileSync(filePath, 'utf8');
    return yaml.load(file) as T;
  } catch (err) {
    console.error(`Failed to load yaml from ${relativePath}`, err);
    return null;
  }
};
