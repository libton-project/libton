import program from 'commander';
import { createLibtonCommand } from './create-libton.command';

export interface CreateCliOptions {
  extend?: boolean;
}

export function createLibtonCli(
  argv: string[],
  options: CreateCliOptions = {},
) {
  const { extend = true } = options;
  argv = extend ? ['node', 'create-libton', ...argv] : argv;
  createLibtonCommand(program);
  program.parse(argv);

  if (!argv.slice(2).length) {
    program.outputHelp();
  }
}
