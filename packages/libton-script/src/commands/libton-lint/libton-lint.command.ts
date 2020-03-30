import commander from 'commander';
import { libtonLint, LibtonLintOptions } from './libton-lint';

export function libtonLintCommand(program: commander.Command) {
  program
    .description('run eslint')
    .action((files, options: LibtonLintOptions) => {
      libtonLint(files, options);
    });
}
