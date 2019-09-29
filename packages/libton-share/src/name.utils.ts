import camelcase from 'camelcase';
import decamelize from 'decamelize';

/**
 *
 * normalize packageName
 *
 * @param packageName
 *
 * @returns remove `@` and replace `/` with `-`
 */
function normalizeName(packageName: string) {
  return packageName.replace('@', '').replace('/', '-');
}

/**
 *
 * convert package name to file name
 *
 * @param packageName
 * @returns normalized and kebab-cased packageName
 *
 * @example
 *
 * ```ts
 * getFilename('my.lib') // => my-lib
 * getFilename('@my-scope/my-lib') // => my-scope-my-lib
 * ```
 *
 */
export function getFilename(packageName: string) {
  return decamelize(camelcase(normalizeName(packageName)), '-');
}

/**
 * convert package name to umd variable name
 *
 * @param packageName
 * @returns normalized and PascalCased packageName
 *
 * @example
 * ```ts
 * getName('my.lib') // => MyLib
 * getName('@my-scope/my-lib') // => MyScopeMyLib
 * ```
 */
export function getName(packageName: string) {
  return camelcase(normalizeName(packageName), { pascalCase: true });
}

/**
 * convert package name to cli name
 *
 * @param packageName
 * @returns normalized and kebab-cased packageName
 *
 * @example
 *
 * ```ts
 * getCliName('my.lib') // => my-lib
 * getCliName('@my-scope/my-lib') // => my-scope-my-lib
 * ```
 */
export function getCliName(packageName: string) {
  return decamelize(camelcase(normalizeName(packageName)), '-');
}
