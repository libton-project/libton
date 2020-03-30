import { createLibton, CreateOptions } from './create-libton';
import commander from 'commander';

export function createLibtonCommand(program: commander.Command) {
  program
    .arguments('<dir>')
    .description('Create new library with libton-script')
    .option('--debug', 'run in debug mode')
    .action((dir: string, options: CreateOptions) => {
      createLibton(dir, options);
    });
}
