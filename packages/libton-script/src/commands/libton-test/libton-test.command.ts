import commander from 'commander';
import { libtonTest, LibtonTestOptions } from './libton-test';

export function libtonTestCommand(program: commander.Command) {
  program
    .description('run tests')
    .allowUnknownOption()
    .arguments('[jest-options...]')
    .action((otherOptions, options: LibtonTestOptions & { args: string[] }) => {
      const jestOptions = options.args;
      libtonTest(jestOptions, options);
    });
}
