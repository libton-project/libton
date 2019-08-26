import { getFilename, getName } from '../utils/name.utils';
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
  const defaultVariableName = getName(packageName);

  const filename = get(libPackage, ['libton', 'filename'], defaultFileName);
  const name = get(libPackage, ['libton', 'name'], defaultVariableName);
  const external = [
    ...Object.keys(libPackage.dependencies || {}),
    ...Object.keys(libPackage.peerDependencies || {}),
  ];
  const globals = get(libPackage, ['libton', 'globals'], {});
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
