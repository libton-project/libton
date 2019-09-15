import spawn from 'cross-spawn';

export function isInsideGitRepo(cwd: string) {
  const ps = spawn.sync('git', ['rev-parse', '--git-dir'], {
    stdio: 'ignore',
    cwd,
  });
  return ps.status === 0;
}
