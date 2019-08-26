import { CLIEngine } from 'eslint';
import { paths } from '../config/paths';
import spawn from 'cross-spawn';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

function lint() {
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

function prettier(fix: boolean, files: string[] = []) {
  const result = spawn.sync(
    'node',
    [
      require.resolve('prettier/bin-prettier.js'),
      fix ? '--write' : '--list-different',
      ...(files.length === 0
        ? ['**/*.{js,jsx,ts,tsx,json,css,scss,md}']
        : files),
    ],
    { stdio: 'inherit' },
  );
  if (result.signal) {
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

const scripts = ['lint', 'format', 'format:check'];
const allowed = ['help', ...scripts];

function help() {
  console.log(`
  libton-script verify
    run all verification scripts
  
  libton-script verify help
    show this message
  
  libton-script verify [script]
    run related scripts. allowed scripts: ${scripts.join(', ')}
  `);
}

function verify() {
  console.log("let's clean the cups ☕");

  const args = process.argv.slice(3);
  const arg = args[0];
  if (!allowed.includes(args[0])) {
    console.error(
      `Invalid arguments ${arg}. only ${allowed.join('|')} arg is allowed`,
    );
    help();
    process.exit(2);
  }

  if (args.length === 0) {
    // run all
    lint();
    prettier(false);
    return;
  }
  if (arg === 'help') {
    help();
    return;
  }
  if (arg === 'lint') {
    lint();
  }
  if (arg === 'format:check') {
    prettier(false);
  }
  if (arg === 'format') {
    prettier(true, args.slice(1));
  }
}

verify();
