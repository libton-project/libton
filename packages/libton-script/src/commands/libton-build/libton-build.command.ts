import { Command } from 'commander';
import { libtonBuild, LibtonBuildOptions } from './libton-build';

export function libtonBuildCommand(program: Command) {
  program
    .description('build .d.ts and js and bin files')
    .action((options: LibtonBuildOptions) => {
      libtonBuild(options);
    });
}
