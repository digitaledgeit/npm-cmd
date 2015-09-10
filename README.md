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

Run `npm install` where:

- `pkgs` is an array of packages to install - optional

- `opts` is an object of key-value pairs - optional
- `opts.global` whether npm should install
- `opts.save` whether npm should save the packages to the `dependencies` key in `package.json`
- `opts.saveDev` whether npm should save the packages to the `devDependencies` key in `package.json`
- `opts.registry` the registry which npm should source package information from

- `done` is a function called when the command has finished - optional 

#### .dedupe(pkgs, opts, done)

Run `npm dedupe` where:

- `pkgs` is an array of packages to dedupe - optional
- `opts` is an object of key-value pairs - optional
- `done` is a function called when the command has finished - optional 

### Options

Global options accepted by all commands:

- `opts.cwd` is the directory where the command will be run