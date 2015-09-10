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
      if (code !== 0 || stderr.indexOf('ERR') !== -1) { //https://github.com/npm/npm/issues/4752
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

/**
 * Set the default args
 *
 * @param {string}                  cmd
 * @param {string|Array.<string>}   [pkgs]
 * @param {Object}                  [opts]
 * @param {function(Error)}         [done]
 * @param {function()}              callback
 *
 */
function args(cmd, pkgs, opts, done, callback) {

  var
    execArgs = [cmd],
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

  if (opts.cwd) {
    execOpts.cwd = opts.cwd;
  }

  execArgs = execArgs.concat(pkgs);

  callback(execArgs, execOpts, done);
}

module.exports = {

  exec: exec,

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
    args('install', pkgs, opts, done, function(execArgs, execOpts, execDone) {

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

      exec(execArgs, execOpts, execDone)
    });
  },

  /**
   * Run `npm dedupe`
   *
   * @see https://docs.npmjs.com/cli/dedupe
   *
   * @param {string|Array.<string>}   [pkgs]
   * @param {Object}                  [opts]
   * @param {function(Error)}         [done]
   */
  dedupe: function(pkgs, opts, done) {
    args('dedupe', pkgs, opts, done, function(execArgs, execOpts, execDone) {
      exec(execArgs, execOpts, execDone)
    });
  }

};

