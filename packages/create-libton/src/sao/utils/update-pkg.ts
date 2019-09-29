import latestVersion from 'latest-version';
import { Generator } from 'sao';

export interface Answers {
  name: string;
  description: string;
  author: string;
  username: string;
  email: string;
  website: string;
  filename: string;
  umdName: string;
  cli: boolean;
  cliName: string;
  preCommit: boolean;
  monoRepo: boolean;
}

const latestVersions = async (dependencies: string[]) => {
  const versions = await Promise.all(
    dependencies.map(dependency =>
      latestVersion(dependency).then(version => [dependency, version]),
    ),
  );
  return versions.reduce(
    (acc, [dependency, version]) => {
      acc[dependency] = version;
      return acc;
    },
    {} as any,
  );
};

export const updatePkg = async (answers: Answers, generator: Generator) => {
  const { name, description, filename, umdName, preCommit, monoRepo } = answers;
  const devDependencies = await latestVersions([
    '@types/jest',
    'libton-script',
    ...((preCommit && !monoRepo && ['husky']) || []),
    ...((preCommit && ['lint-staged']) || []),
  ]);

  if (preCommit && monoRepo) {
    generator.logger.warn();
    generator.logger.warn(
      '⚠️  husky should be installed at the root of mono-repo manually',
    );
    generator.logger.warn();
    generator.logger.warn(
      'read more: https://github.com/libton-project/libton/wiki/Monorepo',
    );
    generator.logger.warn();
  }
  const pmRun = generator.npmClient === 'npm' ? 'npm run' : 'yarn';

  return {
    name,
    description,
    version: '0.0.1',
    license: 'MIT',
    main: `lib/${filename}.js`,
    unpkg: `dist/${filename}.js`,
    module: `es/${filename}.js`,
    typings: './index.d.ts',
    files: [
      'dist',
      'lib',
      'es',
      answers.cli && 'bin',
      'src',
      'index.d.ts',
      'tsdoc-metadata.json',
    ].filter(Boolean),
    ...(answers.cli && {
      bin: {
        [answers.cliName]: `bin/${answers.cliName}.js`,
      },
    }),
    scripts: {
      build: 'libton-script build',
      'build:doc': 'libton-script doc',
      test: 'libton-script test',
      lint: 'libton-script lint',
      format: 'libton-script format',
      'format:check': 'libton-script format --check',
      validate:
        'libton-script lint && libton-script format --check && libton-script test',
      ...(preCommit && monoRepo && { 'pre-commit': 'lint-staged' }),
      prepublishOnly: `${pmRun} validate && ${pmRun} build`,
    },
    devDependencies,
  };
};
