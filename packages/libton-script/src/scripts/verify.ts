// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

function help() {
  console.log(`
  libton-script verify
    run all verification scripts
  
  libton-script verify help
    show this message
  
  libton-script verify [script|scripts]
    run related scripts.
  `);
}

function verify() {
  console.log("let's clean the cups ☕");

  const args = process.argv.slice(3);
  const allowed = ['help'];
  args.forEach(arg => {
    if (!allowed.includes(arg)) {
      console.error(
        `Invalid arguments ${arg}. only ${allowed.join('|')} arg is allowed`,
      );
      help();
      process.exit(2);
    }
  });
  if (args.length === 0) {
    // run all
    return;
  }
  if (args.includes('help')) {
    help();
    return;
  }
}

verify();
