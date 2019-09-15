import spawn from 'cross-spawn';

export interface LibtonFormatOptions {
  check?: boolean;
}
export async function libtonFormat(
  files: string[],
  options: LibtonFormatOptions = {},
) {
  const { check } = options;
  const result = spawn.sync(
    'node',
    [
      require.resolve('prettier/bin-prettier.js'),
      check ? '--check' : '--write',
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
