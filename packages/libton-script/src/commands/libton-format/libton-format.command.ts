import commander from 'commander';
import { libtonFormat, LibtonFormatOptions } from './libton-format';

export function libtonFormatCommand(program: commander.Command) {
  program
    .description('run prettier')
    .option('--check', 'check code style without fixing it')
    .arguments('[files...]')
    .action((files, options: LibtonFormatOptions) => {
      libtonFormat(files, options);
    });
}
