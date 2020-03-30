import path from 'path';
import fs from 'fs';

const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string): string =>
  path.resolve(appDirectory, relativePath);

export const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

type ResolveFn = (relativePath: string) => string;

// Resolve file paths in the same order as webpack
export function resolveModule(resolveFn: ResolveFn, filePath: string): string;
export function resolveModule(
  resolveFn: ResolveFn,
  filePath: string,
  fallback: string,
): string;
export function resolveModule(
  resolveFn: ResolveFn,
  filePath: string,
  fallback: null,
): string | null;
export function resolveModule(
  resolveFn: ResolveFn,
  filePath: string,
  fallback: string | null = '.js',
): string | null {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  if (fallback === null) {
    return null;
  }

  return resolveFn(`${filePath}${fallback}`);
}

export const paths = {
  libRoot: resolveApp(''),
  libSrc: resolveApp('src'),
  libIndex: resolveModule(resolveApp, 'src/index'),
  libDts: resolveApp('index.d.ts'),
  libPackage: resolveApp('package.json'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  docRoot: resolveApp('docs/api/'),
  outputDirs: {
    dist: resolveApp('dist'),
    lib: resolveApp('lib'),
    es: resolveApp('es'),
  },
  cache: resolveApp('.cache'),
};
