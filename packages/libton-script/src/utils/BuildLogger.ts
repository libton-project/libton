import clr from 'colorette';
import path from 'path';
import ms from 'pretty-ms';

interface Options {
  base?: string;
}

export class BuildLogger {
  private startTime: number | null = null;
  private output: string | null = null;
  constructor(private options: Options = {}) {}

  public getRelativePath(file: string) {
    return this.options.base === undefined
      ? file
      : path.relative(this.options.base, file);
  }

  start() {
    this.startTime = Date.now();
  }

  completed() {
    let output = this.output
      ? `created ${clr.bold(this.getRelativePath(this.output))}`
      : 'completed';
    output += this.startTime
      ? ` in ${clr.bold(ms(Date.now() - this.startTime))}`
      : '';
    console.error(clr.green(output));
  }

  convert(input: string, output: string) {
    const inputFile = this.getRelativePath(input);
    const outputFile = this.getRelativePath(output);
    this.output = outputFile;

    console.error(clr.cyan(`${clr.bold(inputFile)} → ${clr.bold(outputFile)}`));
  }

  title(title: string) {
    console.error(); // empty new line
    console.error(clr.cyan(title));
  }

  error(message: string) {
    console.error(clr.red(message));
  }
}
