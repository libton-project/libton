// Do this as the first thing so that any code reading it knows the right env.
import jest from 'jest';
import fs from 'fs';
import { moduleFileExtensions, paths } from '../config/paths';

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

function test() {
  console.log("let's taste the tea ☕");

  let argv = process.argv.slice(2);

  // Use this instead of `paths.testsSetup` to avoid putting
  // an absolute filename into configuration
  const setupTestsMatches = paths.testsSetup.match(/src[/\\]setupTests\.(.+)/);
  const setupTestsFileExtension =
    (setupTestsMatches && setupTestsMatches[1]) || 'js';
  const setupTestsFile = fs.existsSync(paths.testsSetup)
    ? `<rootDir>/src/setupTests.${setupTestsFileExtension}`
    : undefined;

  const config = {
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

test();
