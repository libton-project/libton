import { config } from '../../config/libton-config';
import clr from 'colorette';
import { BuildLogger } from '../BuildLogger';
import { paths, resolveApp, resolveModule } from '../../config/paths';
import path from 'path';
import { rollup } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { babelConfig } from '../../config/babel-config';
import { BuildEnv } from '../../types';
import replace from 'rollup-plugin-replace';

export async function buildBins() {
  for (const name in config.bin) {
    const file = config.bin[name];
    await buildBin(name, file);
  }
}

async function buildBin(name: string, file: string) {
  const title = `${clr.bold(name)} binary:`;

  const logger = new BuildLogger({ base: paths.libRoot });
  logger.start();
  logger.title(title);

  if (!file.endsWith('.js')) {
    console.error(clr.yellow(`skip ${clr.bold(file)}. (not a js file)`));
    return;
  }

  if (file.startsWith('src/') || file.startsWith('./src/')) {
    console.error(
      clr.red(
        `${clr.bold('bin.' + name)}: ${clr.bold(
          file,
        )} starts with 'src/'. bin filepath shouldn't starts with src.`,
      ),
    );
    process.exit(1);
  }

  const inputBasename = path.join('src', file.replace(/\.js$/, ''));
  const input = resolveModule(resolveApp, inputBasename, null);
  const output = file;

  if (input === null) {
    console.error(clr.red(`${clr.bold(inputBasename + '.ts')} not exists`));
    process.exit(1);
    return;
  }

  logger.convert(input, output);

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

  logger.completed();
}
