import rimraf from 'rimraf';
import { paths } from '../../config/paths';
export function cleanCache() {
  rimraf.sync(paths.cache);
}
