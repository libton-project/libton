import { paths, resolveApp } from '../../config/paths';
import { BuildLogger } from '../BuildLogger';
import { buildTs } from './buildTs';
import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from '@microsoft/api-extractor';
import mkdirp from 'mkdirp';
import spawn from 'cross-spawn';
import { flatten } from 'lodash';
import { libtonFormat } from '../../commands/libton-format/libton-format';
import { getExtractorConfig } from '../../config/extractor-config';
import { copyTypes } from './copy-types';

export async function buildDoc() {
  const title = 'api doc:';

  const logger = new BuildLogger({ base: paths.libRoot });
  logger.start();
  logger.title(title);
  mkdirp.sync(paths.docRoot);
  await buildTs();
  copyTypes();

  const extractorConfig: ExtractorConfig = getExtractorConfig({
    docModel: {
      enabled: true,
      apiJsonFilePath:
        '<projectFolder>/.cache/doc-model/<unscopedPackageName>.api.json',
    },
    tsdocMetadata: {
      enabled: true,
      tsdocMetadataFilePath: '<lookup>',
    },
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

  const result = spawn.sync(
    'node',
    flatten([
      require.resolve('@microsoft/api-documenter/lib/start.js'),
      'markdown',
      ['-i', resolveApp('.cache/doc-model/')],
      ['-o', resolveApp('docs/api/')],
    ]),
    { stdio: 'inherit' },
  );
  if (result.signal) {
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }

  await libtonFormat([paths.docRoot + '/*']);

  logger.completed();
}
