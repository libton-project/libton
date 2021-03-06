import envPreset from '@babel/preset-env';
import reactPreset from '@babel/preset-react';
import typescriptPreset from '@babel/preset-typescript';
import macrosPlugin from 'babel-plugin-macros';
import destructuringPlugin from '@babel/plugin-transform-destructuring';
import decoratorsPlugin from '@babel/plugin-proposal-decorators';
import classPropertiesPlugin from '@babel/plugin-proposal-class-properties';
import objectRestSpreadPlugin from '@babel/plugin-proposal-object-rest-spread';
import transformRuntimePlugin from '@babel/plugin-transform-runtime';

export interface Options {
  helpers?: boolean;
}
export function babelConfig(options: Options = {}) {
  const { helpers = false } = options;
  return {
    presets: [
      [
        // Latest stable ECMAScript features
        envPreset,
        {
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: 'entry',
          // Set the corejs version we are using to avoid warnings in console
          // This will need to change once we upgrade to corejs@3
          corejs: 3,
          // Do not transform modules to CJS
          modules: false,
          // Exclude transforms that make all code slower
          exclude: ['transform-typeof-symbol'],
        },
      ],
      [
        reactPreset,
        {
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
        },
      ],
      [typescriptPreset],
    ],
    plugins: [
      ...(helpers ? [transformRuntimePlugin] : []),
      [macrosPlugin],
      [destructuringPlugin, { loose: false }],
      [decoratorsPlugin, { legacy: true }],
      [classPropertiesPlugin],
      [
        objectRestSpreadPlugin,
        {
          useBuiltIns: true,
        },
      ],
    ],
    exclude: '**/node_modules/**',
    extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
    ...(helpers && { runtimeHelpers: true }),
  };
}
