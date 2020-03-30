import commander from 'commander';
import { libtonBuildCommand } from '../libton-build/libton-build.command';
import { libtonTestCommand } from '../libton-test/libton-test.command';
import { libtonFormatCommand } from '../libton-format/libton-format.command';
import { libtonLintCommand } from '../libton-lint/libton-lint.command';
import { libtonBuildDocCommand } from '../libton-build-doc/libton-build-doc.command';

export function libtonScriptCommand(program: commander.Command) {
  program.description('☕  libton script  ☕');

  libtonBuildCommand(program.command('build'));
  libtonTestCommand(program.command('test'));
  libtonLintCommand(program.command('lint'));
  libtonFormatCommand(program.command('format'));
  libtonBuildDocCommand(program.command('doc'));
}
