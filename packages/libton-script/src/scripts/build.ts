import ms from 'pretty-ms';
import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import colorette from 'colorette';
import { babelConfig } from '../config/babel-config';
import path from 'path';
import { promises as fs } from 'fs';
import { paths } from '../config/paths';
import { config, LibtonConfig } from '../config/libton-config';
import { BuildEnv } from '../types';
import { generateDtsBundle } from 'dts-bundle-generator';
import { format } from 'prettier';

console.log("let's make a tea ☕");

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
    default:
      throw new Error('Invalid env param');
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

function logStart(input: string, output: string) {
  const start = Date.now();

  const inputFile = path.relative(paths.libRoot, input);
  const outputFile = path.relative(paths.libRoot, output);
  console.error(
    colorette.cyan(
      `\n${colorette.bold(inputFile)} → ${colorette.bold(outputFile)}`,
    ),
  );

  return function logEnd() {
    console.error(
      colorette.green(
        `created ${colorette.bold(outputFile)} in ${colorette.bold(
          ms(Date.now() - start),
        )}`,
      ),
    );
  };
}

async function build(env: BuildEnv) {
  const compress =
    env === BuildEnv.ES_FOR_BROWSERS || env === BuildEnv.UMD_PRODUCTION;
  const file = getFile(env, config);
  const input = paths.libIndex;
  const logEnd = logStart(input, file);
  const replaceNodeEnv =
    env === BuildEnv.ES_FOR_BROWSERS ||
    env === BuildEnv.UMD_DEVELOPMENT ||
    env === BuildEnv.UMD_PRODUCTION;
  const nodeEnv =
    env === BuildEnv.UMD_DEVELOPMENT ? 'development' : 'production';
  const bundle = await rollup({
    input,
    external: config.external,
    plugins: [
      resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
      }),
      commonjs(),
      babel(babelConfig(env)),
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
  logEnd();
}

async function buildDts() {
  const input = paths.libIndex;
  const output = paths.libDts;

  const logEnd = logStart(input, output);
  const outputs = generateDtsBundle([
    {
      filePath: input,
    },
  ]);
  const content = outputs[0];
  const prettyContent = format(content, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all',
  });
  await fs.writeFile(output, prettyContent);
  logEnd();
}

async function buildAll() {
  await build(BuildEnv.COMMON_JS);
  await build(BuildEnv.ES);
  await build(BuildEnv.ES_FOR_BROWSERS);
  await build(BuildEnv.UMD_DEVELOPMENT);
  await build(BuildEnv.UMD_PRODUCTION);
  await buildDts();
}

buildAll();
