var npm = require('..');

npm.install(['digitaledgeit-view', 'digitaledgeit-view-collection'], {cwd: 'c:/tmp', save: true}, function(err) {
  console.log('installed?', err);

  npm.dedupe({cwd: 'c:/tmp'}, function(err) {
    console.log('dedupeed?', err);
  });

});