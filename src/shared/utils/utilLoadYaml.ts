import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

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
