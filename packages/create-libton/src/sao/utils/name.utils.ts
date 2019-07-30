import camelcase from 'camelcase';
import decamelize from 'decamelize';
// TODO refactor: create and share core logic

function normalizeName(packageName: string) {
  return packageName.replace('@', '').replace('/', '-');
}

export function getFilename(packageName: string) {
  return decamelize(camelcase(normalizeName(packageName)), '-');
}

export function getName(packageName: string) {
  return camelcase(normalizeName(packageName), { pascalCase: true });
}
