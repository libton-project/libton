import { paths } from '../../config/paths';
import { BuildLogger } from '../BuildLogger';
import { generateDtsBundle } from 'dts-bundle-generator';
import { config } from '../../config/libton-config';
import { format } from 'prettier';
import { promises as fs } from 'fs';

export async function buildDts() {
  const input = paths.libIndex;
  const output = paths.libDts;
  const title = 'type definitions:';

  const logger = new BuildLogger({ base: paths.libRoot });
  logger.start();
  logger.title(title);
  logger.convert(input, output);
  const outputs = generateDtsBundle([
    {
      filePath: input,
      libraries: {
        importedLibraries: config.external,
      },
    },
  ]);
  const content = outputs[0];
  const prettyContent = format(content, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all',
  });
  await fs.writeFile(output, prettyContent);
  logger.completed();
}
