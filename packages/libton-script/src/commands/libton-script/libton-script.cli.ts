import program from 'commander';
import { libtonScriptCommand } from './libton-script.command';

export interface LibtonScriptCliOptions {
  extend?: boolean;
}

export function libtonScriptCli(
  argv: string[],
  options: LibtonScriptCliOptions = {},
) {
  const { extend = true } = options;
  argv = extend ? ['node', 'libton', ...argv] : argv;

  libtonScriptCommand(program);

  program.on('command:*', function() {
    console.error(
      'Invalid command: %s\nSee --help for a list of available commands.',
      program.args.join(' '),
    );
    process.exit(1);
  });

  program.parse(argv);

  if (!argv.slice(2).length) {
    program.outputHelp();
  }
}
