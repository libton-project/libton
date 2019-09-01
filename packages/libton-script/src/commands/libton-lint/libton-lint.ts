import { CLIEngine } from 'eslint';
import { paths } from '../../config/paths';

export interface LibtonLintOptions {}

export async function libtonLint(files: string[], options: LibtonLintOptions) {
  const cliEngine = new CLIEngine({
    baseConfig: {
      extends: ['plugin:react-app/recommended'],
      settings: {
        react: { version: 'latest' },
      },
    },
    cwd: paths.libRoot,
  });
  const report = cliEngine.executeOnFiles(['src/**/*.{js,mjs,jsx,ts,tsx}']);
  const formatter = cliEngine.getFormatter();

  console.info(formatter(report.results));

  if (report.warningCount > 0 || report.errorCount > 0) {
    process.exit(1);
  }
}
