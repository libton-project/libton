import commander from 'commander';
import { libtonBuild, LibtonBuildOptions } from './libton-build';

export function libtonBuildCommand(program: commander.Command) {
  program
    .description('build .d.ts and js and bin files')
    .action((options: LibtonBuildOptions) => {
      libtonBuild(options);
    });
}
