#!/usr/bin/env node

import { libtonScriptCli } from '..';

process.on('unhandledRejection', err => {
  throw err;
});

libtonScriptCli(process.argv, { extend: false });
