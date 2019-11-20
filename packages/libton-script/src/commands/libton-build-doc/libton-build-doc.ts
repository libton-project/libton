import { buildDoc } from '../../utils/build/buildDoc';
import { cleanCache } from '../../utils/build/cleanCache';

export interface LibtonBuildDocOptions {}
export async function libtonBuildDoc(options: LibtonBuildDocOptions) {
  console.log("let's write ingredients of tea ☕");

  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';

  await cleanCache();
  await buildDoc();
}
