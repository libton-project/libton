import { BuildEnv } from '../types';
import { buildDts } from '../utils/build/buildDts';
import { buildBins } from '../utils/build/buildBins';
import { build } from '../utils/build/buildBundels';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

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
