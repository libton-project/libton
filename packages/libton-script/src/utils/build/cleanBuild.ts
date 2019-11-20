import rimraf from 'rimraf';
import { paths } from '../../config/paths';
export function cleanBuild() {
  rimraf.sync(paths.libDts);
  rimraf.sync(paths.outputDirs.es);
  rimraf.sync(paths.outputDirs.lib);
  rimraf.sync(paths.outputDirs.dist);
}
