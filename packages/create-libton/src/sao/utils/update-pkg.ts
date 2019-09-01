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
  const { name, description, filename, umdName } = answers;

  const devDependencies = await latestVersions([
    '@types/jest',
    'libton-script',
  ]);

  console.log(generator.npmClient);
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
    ].filter(Boolean),
    ...(answers.cli && {
      bin: {
        [answers.cliName]: `bin/${answers.cliName}.js`,
      },
    }),
    scripts: {
      build: 'libton-script build',
      test: 'libton-script test',
      lint: 'libton-script lint',
      format: 'libton-script format',
      'format:check': 'libton-script format --check',
      validate:
        'libton-script lint && libton-script format --check && libton-script test',
      prepublishOnly: `${pmRun} validate && ${pmRun} build`,
    },
    devDependencies,
    libton: {
      filename,
      name: umdName,
    },
  };
};
