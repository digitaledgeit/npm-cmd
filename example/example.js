var npm = require('..');

npm.install(['foobar'], {cwd: 'c:/tmp'}, function(err) {
  console.log('installed?', err);
});