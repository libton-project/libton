import { buildDoc } from '../../utils/build/buildDoc';

export interface LibtonBuildDocOptions {}
export function libtonBuildDoc(options: LibtonBuildDocOptions) {
  console.log("let's write ingredients of tea ☕");

  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';

  buildDoc();
}
