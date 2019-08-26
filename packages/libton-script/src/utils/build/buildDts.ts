import { paths, resolveApp } from '../../config/paths';
import { BuildLogger } from '../BuildLogger';
import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from '@microsoft/api-extractor';
import { buildTs } from './buildTs';

export async function buildDts() {
  const input = paths.libIndex;
  const output = paths.libDts;
  const title = 'type definitions:';

  const logger = new BuildLogger({ base: paths.libRoot });
  logger.start();
  logger.title(title);
  logger.convert(input, output);
  await buildTs();
  const extractorConfig: ExtractorConfig = ExtractorConfig.prepare({
    configObject: {
      projectFolder: paths.libRoot,
      mainEntryPointFilePath: resolveApp('.cache/build/index.d.ts'),
      dtsRollup: {
        enabled: true,
        untrimmedFilePath: output,
      },
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

  const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  });

  if (!extractorResult.succeeded) {
    logger.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`,
    );
    process.exit(1);
  }

  logger.completed();
}
