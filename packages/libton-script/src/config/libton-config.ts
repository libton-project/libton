import { cosmiconfigSync } from 'cosmiconfig';
import { getFilename, getName } from '@libton/share';
import get from 'lodash/get';
import { paths } from './paths';
import readPkg from 'read-pkg';

export interface LibtonConfig {
  packageName: string;
  filename: string;
  name: string;
  external: string[];
  globals: Record<string, string>;
  bin: Record<string, string>;
}

function getLibtonConfig(): LibtonConfig {
  const libPackage = readPkg.sync({ cwd: paths.libRoot });
  const packageName = libPackage.name;
  const defaultFileName = getFilename(packageName);
  const defaultName = getName(packageName);

  const external = [
    ...Object.keys(libPackage.dependencies || {}),
    ...Object.keys(libPackage.peerDependencies || {}),
  ];

  const result = cosmiconfigSync('libton').search(paths.libRoot);
  const config = result ? result.config : {};

  const {
    name = defaultName,
    filename = defaultFileName,
    globals = {},
  } = config;

  const bin = get(libPackage, ['bin'], {});

  return {
    packageName,
    filename,
    name,
    external,
    globals,
    bin,
  };
}

export const config: LibtonConfig = getLibtonConfig();
