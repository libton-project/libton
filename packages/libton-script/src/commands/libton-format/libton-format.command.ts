import { Command } from 'commander';
import { libtonFormat, LibtonFormatOptions } from './libton-format';

export function libtonFormatCommand(program: Command) {
  program
    .description('run prettier')
    .option('--check', 'check code style without fixing it')
    .arguments('[files...]')
    .action((files, options: LibtonFormatOptions) => {
      libtonFormat(files, options);
    });
}
