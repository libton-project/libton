import { Command } from 'commander';
import { libtonLint, LibtonLintOptions } from './libton-lint';

export function libtonLintCommand(program: Command) {
  program
    .description('run eslint')
    .action((files, options: LibtonLintOptions) => {
      libtonLint(files, options);
    });
}
