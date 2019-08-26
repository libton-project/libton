import flatten from 'lodash/flatten';
import spawn from 'cross-spawn';
import { paths, resolveApp } from '../../config/paths';

export async function buildTs() {
  const result = spawn.sync(
    'node',
    flatten([
      require.resolve('typescript/lib/tsc.js'),
      ['--project', resolveApp('tsconfig.json')],
      '--declaration',
      '--declarationMap',
      ['--module', 'commonjs'],
      '--sourceMap',
      ['--outDir', resolveApp('.cache/build')],
      ['--isolatedModules', 'false'],
      ['--noEmit', 'false'],
    ]),
    { stdio: 'inherit' },
  );
  if (result.signal) {
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}
