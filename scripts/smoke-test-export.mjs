import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? '.');
const changelogPath = path.join(root, 'changelog', 'index.html');
const html = await fs.readFile(changelogPath, 'utf8');

const checks = [
  ['changelog content', html.includes('Баланс КЦ')],
  ['Next bootstrap array', html.includes('self.__next_s=self.__next_s||[]')],
  ['local changelog images', html.includes('/images/changelog/0-4-3/')],
  ['no Google Fonts head refs', !html.includes('fonts.googleapis.com') && !html.includes('fonts.gstatic.com')],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);

if (failed.length > 0) {
  throw new Error(`Export smoke test failed: ${failed.join(', ')}`);
}

console.log(`Export smoke test passed for ${changelogPath}`);
