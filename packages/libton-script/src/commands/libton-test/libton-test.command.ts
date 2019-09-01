import cli, { Command } from 'commander';
import { libtonTest, LibtonTestOptions } from './libton-test';
import getRemainingArgs from 'commander-remaining-args';
export function libtonTestCommand(program: Command) {
  program
    .description('run tests')
    .allowUnknownOption()
    .arguments('[jest-options...]')
    .action((otherOptions, options: LibtonTestOptions) => {
      const jestOptions = getRemainingArgs(cli);
      libtonTest(jestOptions, options);
    });
}
