import { moduleFileExtensions, paths } from '../../config/paths';
import fs from 'fs';
import jest from 'jest';

export interface LibtonTestOptions {}
export async function libtonTest(
  jestOptions: string[],
  options: LibtonTestOptions,
) {
  console.log("let's taste the tea ☕");

  process.env.BABEL_ENV = 'test';
  process.env.NODE_ENV = 'test';

  const argv = [...jestOptions];
  // Use this instead of `paths.testsSetup` to avoid putting
  // an absolute filename into configuration
  const setupTestsMatches = paths.testsSetup.match(/src[/\\]setupTests\.(.+)/);
  const setupTestsFileExtension =
    (setupTestsMatches && setupTestsMatches[1]) || 'js';
  const setupTestsFile = fs.existsSync(paths.testsSetup)
    ? `<rootDir>/src/setupTests.${setupTestsFileExtension}`
    : undefined;

  const config = {
    globals: {
      'ts-jest': {
        tsConfig: {
          jsx: 'react',
        },
      },
    },
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
    setupFilesAfterEnv: setupTestsFile ? [setupTestsFile] : [],
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    ],
    moduleFileExtensions: [...moduleFileExtensions, 'node'].filter(
      ext => !ext.includes('mjs'),
    ),
    rootDir: paths.libRoot,
  };

  argv.push('--config', JSON.stringify(config));

  jest.run(argv);
}
