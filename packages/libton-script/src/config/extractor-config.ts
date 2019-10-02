import {
  ExtractorConfig,
  IExtractorConfigPrepareOptions,
} from '@microsoft/api-extractor';
import { paths, resolveApp } from './paths';

export function getExtractorConfig(
  config: Partial<IExtractorConfigPrepareOptions['configObject']>,
): ExtractorConfig {
  return ExtractorConfig.prepare({
    configObject: {
      ...config,
      projectFolder: paths.libRoot,
      mainEntryPointFilePath: resolveApp(
        '.cache/build/__type_d_and_index.d.ts',
      ),
      compiler: {
        tsconfigFilePath: resolveApp('tsconfig.json'),
        overrideTsconfig: {
          compilerOptions: {
            isolatedModules: false,
            declaration: true,
            declarationMap: true,
            module: 'commonjs',
            outDir: '.cache/build',
            sourceMap: true,
            noEmit: false,
          },
        },
      },
    },
    configObjectFullPath: undefined,
    packageJsonFullPath: paths.libPackage,
  });
}
