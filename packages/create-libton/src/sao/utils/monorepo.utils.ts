import spawn from 'cross-spawn';
import findUp from 'find-up';

const haveYarn = (cwd: string): boolean =>
  spawn.sync('yarn', ['--version'], {
    stdio: 'ignore',
    cwd,
  }).status === 0;

const haveLerna = (cwd: string): boolean =>
  spawn.sync('lerna', ['--version'], {
    stdio: 'ignore',
    cwd,
  }).status === 0;

const isInsideYarnWorkspace = (cwd: string): boolean =>
  spawn.sync('yarn', ['workspaces', 'info'], {
    stdio: 'ignore',
    cwd,
  }).status === 0;

const isInsideLerna = (cwd: string): boolean =>
  spawn.sync('lerna', ['list'], {
    stdio: 'ignore',
    cwd,
  }).status === 0;

const findExistingParentDir = (cwd: string): string | undefined => {
  return findUp.sync(
    (dir: string): findUp.Match => {
      if (findUp.sync.exists(dir)) {
        return dir;
      }
    },
    { cwd, type: 'directory' },
  );
};

export function isInsideMonoRepo(cwd: string): boolean {
  const root = findExistingParentDir(cwd);
  if (!root) {
    return false;
  }
  return (
    (haveLerna(root) && isInsideLerna(root)) ||
    (haveYarn(root) && isInsideYarnWorkspace(root))
  );
}
