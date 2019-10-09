import { BuildEnv } from '../../types';
import { config, LibtonConfig } from '../../config/libton-config';
import path from 'path';
import { paths } from '../../config/paths';
import { BuildLogger } from '../BuildLogger';
import { rollup } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { babelConfig } from '../../config/babel-config';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

function getFormat(env: BuildEnv) {
  switch (env) {
    case BuildEnv.COMMON_JS:
      return 'cjs';
    case BuildEnv.ES:
    case BuildEnv.ES_FOR_BROWSERS:
      return 'es';
    case BuildEnv.UMD_DEVELOPMENT:
    case BuildEnv.UMD_PRODUCTION:
      return 'umd';
  }
}

function getFile(env: BuildEnv, config: LibtonConfig) {
  switch (env) {
    case BuildEnv.COMMON_JS:
      return path.join(paths.outputDirs.lib, config.filename + '.js');
    case BuildEnv.ES:
      return path.join(paths.outputDirs.es, config.filename + '.js');
    case BuildEnv.ES_FOR_BROWSERS:
      return path.join(paths.outputDirs.es, config.filename + '.mjs');
    case BuildEnv.UMD_DEVELOPMENT:
      return path.join(paths.outputDirs.dist, config.filename + '.js');
    case BuildEnv.UMD_PRODUCTION:
      return path.join(paths.outputDirs.dist, config.filename + '.min.js');
  }
}

function getTitle(env: BuildEnv) {
  switch (env) {
    case BuildEnv.COMMON_JS:
      return 'common js:';
    case BuildEnv.ES:
      return 'es:';
    case BuildEnv.ES_FOR_BROWSERS:
      return 'es for browsers:';
    case BuildEnv.UMD_DEVELOPMENT:
      return 'umd development:';
    case BuildEnv.UMD_PRODUCTION:
      return 'umd production:';
  }
}

export async function build(env: BuildEnv) {
  const compress =
    env === BuildEnv.ES_FOR_BROWSERS || env === BuildEnv.UMD_PRODUCTION;
  const file = getFile(env, config);
  const input = paths.libIndex;
  const title = getTitle(env);
  const logger = new BuildLogger({ base: paths.libRoot });
  logger.start();
  logger.title(title);
  logger.convert(input, file);
  const replaceNodeEnv =
    env === BuildEnv.ES_FOR_BROWSERS ||
    env === BuildEnv.UMD_DEVELOPMENT ||
    env === BuildEnv.UMD_PRODUCTION;
  const nodeEnv =
    env === BuildEnv.UMD_DEVELOPMENT ? 'development' : 'production';
  const babelHelpers = env === BuildEnv.COMMON_JS;
  const bundle = await rollup({
    input,
    external: config.external,
    plugins: [
      resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
      }),
      commonjs(),
      babel(babelConfig({ helpers: babelHelpers })),
      replaceNodeEnv &&
        replace({
          'process.env.NODE_ENV': JSON.stringify(nodeEnv),
        }),
      compress &&
        terser({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
          },
        }),
    ].filter(Boolean),
  });
  await bundle.write({
    file,
    format: getFormat(env),
    indent: false,
    globals: config.globals,
    name: config.name,
  });
  logger.completed();
}
