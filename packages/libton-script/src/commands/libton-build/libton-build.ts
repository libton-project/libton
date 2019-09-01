import { buildDts } from '../../utils/build/buildDts';
import { build } from '../../utils/build/buildBundels';
import { BuildEnv } from '../../types';
import { buildBins } from '../../utils/build/buildBins';

export interface LibtonBuildOptions {}
export async function libtonBuild(options: LibtonBuildOptions) {
  console.log("let's make a tea ☕");

  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';

  await buildDts();
  await build(BuildEnv.COMMON_JS);
  await build(BuildEnv.ES);
  await build(BuildEnv.ES_FOR_BROWSERS);
  await build(BuildEnv.UMD_DEVELOPMENT);
  await build(BuildEnv.UMD_PRODUCTION);
  await buildBins();
}
