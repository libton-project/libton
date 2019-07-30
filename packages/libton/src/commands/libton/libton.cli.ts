import program from 'commander';
import { libtonCommand } from './libton.command';

export interface LibtonCliOptions {
  extend?: boolean;
}

export function libtonCli(argv: string[], options: LibtonCliOptions = {}) {
  const { extend = true } = options;
  argv = extend ? ['node', 'libton', ...argv] : argv;

  libtonCommand(program);
  program.parse(argv);

  if (!argv.slice(2).length) {
    program.outputHelp();
  }
}
