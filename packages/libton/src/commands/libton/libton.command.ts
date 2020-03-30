import commander, { Command } from 'commander';
import { createLibtonCommand } from 'create-libton';

export function libtonCommand(program: commander.Command) {
  program.description('☕  libton cli  ☕');

  createLibtonCommand(program.command('create'));
}
