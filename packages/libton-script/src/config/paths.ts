import path from 'path';
import fs from 'fs';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string): string =>
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
const resolveModule = (resolveFn: ResolveFn, filePath: string) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

export const paths = {
  libRoot: resolveApp(''),
  libSrc: resolveApp('src'),
  libIndex: resolveModule(resolveApp, 'src/index'),
  libDts: resolveApp('index.d.ts'),
  libPackage: resolveApp('package.json'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  outputDirs: {
    dist: resolveApp('dist'),
    lib: resolveApp('lib'),
    es: resolveApp('es'),
  },
};
