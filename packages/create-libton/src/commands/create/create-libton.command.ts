import { Command } from 'commander';
import { createLibton, CreateOptions } from './create-libton';

export function createLibtonCommand(program: Command) {
  program
    .arguments('<dir>')
    .description('Create new library with libton-script')
    .option('--debug', 'run in debug mode')
    .action((dir: string, options: CreateOptions) => {
      createLibton(dir, options);
    });
}
