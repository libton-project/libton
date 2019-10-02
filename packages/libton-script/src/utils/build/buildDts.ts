import { paths } from '../../config/paths';
import { BuildLogger } from '../BuildLogger';
import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from '@microsoft/api-extractor';
import { buildTs } from './buildTs';
import { libtonFormat } from '../../commands/libton-format/libton-format';
import { getExtractorConfig } from '../../config/extractor-config';
import { copyTypes } from './copy-types';

export async function buildDts() {
  const input = paths.libIndex;
  const output = paths.libDts;
  const title = 'type definitions:';

  const logger = new BuildLogger({ base: paths.libRoot });
  logger.start();
  logger.title(title);
  logger.convert(input, output);
  await buildTs();
  copyTypes();

  const extractorConfig: ExtractorConfig = getExtractorConfig({
    dtsRollup: {
      enabled: true,
      untrimmedFilePath: output,
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

  await libtonFormat([paths.libDts]);

  logger.completed();
}
