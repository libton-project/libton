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
import { paths, resolveApp, resolveModule } from '../config/paths';
import { config, LibtonConfig } from '../config/libton-config';
import { BuildEnv } from '../types';
import { generateDtsBundle } from 'dts-bundle-generator';
import { format } from 'prettier';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

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

function logStart(title: string, input: string | null, output: string | null) {
  const start = Date.now();

  console.error(); // empty new line
  console.error(colorette.cyan(title));

  if (input && output) {
    const inputFile = path.relative(paths.libRoot, input);
    const outputFile = path.relative(paths.libRoot, output);
    console.error(
      colorette.cyan(
        `${colorette.bold(inputFile)} → ${colorette.bold(outputFile)}`,
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
  return () => {};
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

async function build(env: BuildEnv) {
  const compress =
    env === BuildEnv.ES_FOR_BROWSERS || env === BuildEnv.UMD_PRODUCTION;
  const file = getFile(env, config);
  const input = paths.libIndex;
  const title = getTitle(env);
  const logEnd = logStart(title, input, file);
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
  const title = 'type definitions:';

  const logEnd = logStart(title, input, output);
  const outputs = generateDtsBundle([
    {
      filePath: input,
      libraries: {
        importedLibraries: config.external,
      },
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

async function buildBins() {
  for (const name in config.bin) {
    const file = config.bin[name];
    await buildBin(name, file);
  }
}

async function buildBin(name: string, file: string) {
  const title = `${colorette.bold(name)} binary:`;

  if (!file.endsWith('.js')) {
    logStart(title, null, null);
    console.error(
      colorette.yellow(`skip ${colorette.bold(file)}. (not a js file)`),
    );
    return;
  }

  const inputBasename = path.join('src', file.replace(/\.js$/, ''));

  const input = resolveModule(resolveApp, inputBasename, null);
  const output = file;
  const logEnd = logStart(title, input, output);

  if (file.startsWith('src/') || file.startsWith('./src/')) {
    console.error(
      colorette.red(
        `${colorette.bold('bin.' + name)}: ${colorette.bold(
          file,
        )} starts with 'src/'. bin filepath shouldn't starts with src.`,
      ),
    );
    process.exit(1);
  }

  if (input === null) {
    console.error(
      colorette.red(`${colorette.bold(inputBasename + '.ts')} not exists`),
    );
    process.exit(1);
    return;
  }

  const bundle = await rollup({
    input,
    external: config.external,
    plugins: [
      resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
      }),
      commonjs(),
      babel(babelConfig(BuildEnv.COMMON_JS)),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ].filter(Boolean),
  });
  await bundle.write({
    file,
    format: 'cjs',
    indent: false,
    banner: '#!/usr/bin/env node', // make file executable
    globals: config.globals,
  });

  logEnd();
}

async function buildAll() {
  console.log("let's make a tea ☕");

  await buildDts();
  await build(BuildEnv.COMMON_JS);
  await build(BuildEnv.ES);
  await build(BuildEnv.ES_FOR_BROWSERS);
  await build(BuildEnv.UMD_DEVELOPMENT);
  await build(BuildEnv.UMD_PRODUCTION);
  await buildBins();
}

buildAll();
