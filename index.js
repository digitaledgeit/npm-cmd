var debug = require('debug')('npm-cmd');
var spawn = require('child_process').spawn;
var cmd   = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function error(msg, cmd, args, opts, stderr, prev) {
  var err = new Error(msg);

  err.cmd     = cmd;
  err.args    = args;
  err.opts    = opts;
  err.stderr  = stderr;

  if (prev) {
    err.prev = prev;
  }

  return err;
}

/**
 * Execute a npm command
 * @param   {Array.<string>}  args
 * @param   {Object}          opts
 * @param   {function(Error)} done
 */
function exec(args, opts, done) {

  debug('`%s`', [cmd].concat(args).join(' '), opts);

  var stderr = '';

  spawn(cmd, args, opts)
    .on('error', function(prev) {
      done(error('NPM failed due to an error.', cmd, args, opts, stderr, prev));
    })
    .on('close', function(code) {
      if (code !== 0) {
        done(error('NPM exited due to an error.', cmd, args, opts, stderr));
      } else {
        done(null);
      }
    })
    .stderr.on('data', function(data) {
      stderr += String(data);
    })
  ;

}

module.exports = {

  /**
   * Run `npm install`
   *
   * @see https://docs.npmjs.com/cli/install
   *
   * @param {string|Array.<string>}   [pkgs]
   * @param {Object}                  [opts]
   * @param {function(Error)}         [done]
   *
   */
  install: function(pkgs, opts, done) {

    var
      execArgs = ['install'],
      execOpts = {}
    ;

    // --- decide what options were passed ---

    switch (typeof(pkgs)) {

      case 'object':
        if (!Array.isArray(pkgs)) {
          done = opts;
          opts = pkgs;
          pkgs = [];
        }
        break;

      case 'function':
        done = pkgs;
        opts = {};
        pkgs = [];
        break;

      default:
        pkgs = [pkgs];

    }

    if (arguments.length > 1) {
      if (typeof(opts) === 'function') {
        done = opts;
        opts = {};
      }
    }

    //default callback to a noop
    opts = opts || {};
    done = done || function(){};

    if (opts.global) {
      execArgs.push('-g');
    }

    if (opts.save) {
      execArgs.push('--save');
    }

    if (opts.saveDev) {
      execArgs.push('--save-dev');
    }

    if (opts.registry) {
      execArgs.push('--registry='+opts.registry);
    }

    if (opts.cwd) {
      execOpts.cwd = opts.cwd;
    }

    execArgs = execArgs.concat(pkgs);

    exec(execArgs, execOpts, done);
  }

};

