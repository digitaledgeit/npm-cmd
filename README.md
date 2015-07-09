# npm-cmd

An API to execute `npm` commands programmatically.

## Installation

    npm install --save npm-cmd
    
## Usage

    var npm = require('npm-cmd');
    
    npm.install(['express', 'cookie-parser'], {save: true, cwd: '/tmp'}, function(err) {
      if (err) {
        console.log('Installation failed.');
      } else {
        console.log('Installation succeeded!'); 
      }       
    });
    
## API

### Methods

#### .install(pkgs, opts, done)

Run `npm install`.