import { Command } from 'commander';
import { libtonBuildDoc, LibtonBuildDocOptions } from './libton-build-doc';

export function libtonBuildDocCommand(program: Command) {
  program
    .description('generate api doc from comments')
    .action((options: LibtonBuildDocOptions) => {
      libtonBuildDoc(options);
    });
}
